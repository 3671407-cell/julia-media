#!/usr/bin/env python3
"""ИИ-помощник в сообщениях ВК-группы Юлии Жарковой (club241191251). Запускается GitHub Actions каждые 10 минут.

Берёт неотвеченные диалоги, отвечает по правилам (vk-assistant-prompt.md + факты из секрета FACTS_B64),
сложное передаёт Юлии уведомлением в Telegram. Если в диалоге за последние сутки писала сама Юлия (админ) — молчит.
Секреты: VK_GROUP_TOKEN, OPENROUTER_API_KEY, FACTS_B64, TG_BOT_TOKEN, TG_CHAT_ID.
"""
import base64, json, os, random, re, time, urllib.parse, urllib.request

GROUP = 241191251
V = "5.199"
HERE = os.path.dirname(os.path.abspath(__file__))
MODEL = "anthropic/claude-haiku-5.5"


def vk(method, **p):
    p.update(access_token=os.environ["VK_GROUP_TOKEN"], v=V)
    r = json.load(urllib.request.urlopen(urllib.request.Request("https://api.vk.com/method/" + method, data=urllib.parse.urlencode(p).encode()), timeout=30))
    if "error" in r:
        raise RuntimeError(f"VK {method}: {r['error'].get('error_msg')}")
    return r["response"]


def llm(system, messages):
    body = {"model": MODEL, "max_tokens": 1500, "messages": [{"role": "system", "content": system}] + messages}
    req = urllib.request.Request("https://openrouter.ai/api/v1/chat/completions", data=json.dumps(body).encode(),
                                 headers={"Authorization": "Bearer " + os.environ["OPENROUTER_API_KEY"], "Content-Type": "application/json"})
    t = json.load(urllib.request.urlopen(req, timeout=120))["choices"][0]["message"]["content"]
    m = re.search(r"\{.*\}", t, re.S)
    return json.loads(m.group(0))


def tg(text):
    tok, chat = os.environ.get("TG_BOT_TOKEN"), os.environ.get("TG_CHAT_ID")
    if not tok or not chat:
        return
    urllib.request.urlopen(urllib.request.Request(f"https://api.telegram.org/bot{tok}/sendMessage",
        data=json.dumps({"chat_id": chat, "text": text, "disable_web_page_preview": True}).encode(),
        headers={"Content-Type": "application/json"}), timeout=30)


def system_prompt():
    facts = base64.b64decode(os.environ["FACTS_B64"]).decode()
    return open(os.path.join(HERE, "vk-assistant-prompt.md"), encoding="utf-8").read().replace("{facts}", facts)


def main():
    convs = vk("messages.getConversations", group_id=GROUP, filter="unanswered", count=20).get("items", [])
    if not convs:
        print("неотвеченных нет"); return
    system = system_prompt()
    for c in convs:
        peer = c["conversation"]["peer"]["id"]
        hist = vk("messages.getHistory", group_id=GROUP, peer_id=peer, count=20)["items"][::-1]
        day = time.time() - 86400
        if any(m.get("admin_author_id") and m["date"] > day for m in hist):
            print(peer, "— Юлия уже ведёт диалог, молчу")
            vk("messages.markAsAnsweredConversation", group_id=GROUP, peer_id=peer, answered=1)
            continue
        msgs = [{"role": "assistant" if m["from_id"] < 0 else "user", "content": m.get("text") or "[вложение]"} for m in hist if (m.get("text") or m.get("attachments"))]
        while msgs and msgs[0]["role"] == "assistant":
            msgs.pop(0)
        if not msgs:
            continue
        ans = llm(system, msgs)
        vk("messages.send", group_id=GROUP, peer_id=peer, random_id=random.randint(1, 2**31), message=ans["reply"])
        print(peer, "ответ отправлен", "→ Юлии" if ans.get("handoff") else "")
        if ans.get("handoff"):
            last = next((m.get("text") for m in reversed(hist) if m["from_id"] > 0), "")
            tg(f"🔔 ВК-группа: нужна Юлия\nКто: vk.com/id{peer}\nПисал(а): {last[:300]}\nЗачем: {ans.get('reason','')}\nДиалог: vk.com/gim{GROUP}?sel={peer}")


if __name__ == "__main__":
    main()
