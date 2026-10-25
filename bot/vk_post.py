#!/usr/bin/env python3
"""Посты в ВК-группу по расписанию (bot/vk-посты.json). Опубликованное — в bot/vk-опубликовано.json (коммитит GitHub Actions)."""
import datetime as dt, json, os, urllib.parse, urllib.request

GROUP = 241191251
HERE = os.path.dirname(os.path.abspath(__file__))
PLAN = os.path.join(HERE, "vk-посты.json")
DONE = os.path.join(HERE, "vk-опубликовано.json")


def main():
    plan = json.load(open(PLAN, encoding="utf-8"))
    done = json.load(open(DONE, encoding="utf-8")) if os.path.exists(DONE) else {}
    now = dt.datetime.now(dt.timezone.utc)
    for p in plan:
        if p["id"] in done or dt.datetime.fromisoformat(p["at"]) > now:
            continue
        q = {"owner_id": -GROUP, "from_group": 1, "message": p["text"], "access_token": os.environ["VK_GROUP_TOKEN"], "v": "5.199"}
        r = json.load(urllib.request.urlopen(urllib.request.Request("https://api.vk.com/method/wall.post", data=urllib.parse.urlencode(q).encode()), timeout=30))
        if "error" in r:
            print("ошибка", p["id"], r["error"].get("error_msg")); return
        done[p["id"]] = {"post_id": r["response"]["post_id"], "at": now.isoformat()}
        json.dump(done, open(DONE, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print("опубликован", p["id"], r["response"]["post_id"])
        return  # не больше одного поста за запуск
    print("по расписанию нечего публиковать")


if __name__ == "__main__":
    main()
