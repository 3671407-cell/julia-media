/* Чат ИИ-помощника. Пока FN_URL пустой, кнопка не показывается. Ссылку функции Яндекс Облака вписать сюда. */
(function(){
var FN_URL='';
if(!FN_URL)return;
var L=(document.documentElement.lang||'ru').slice(0,2);
var T={
ru:{btn:'Задать вопрос ИИ-помощнику',title:'ИИ-помощник Юлии',hello:'Здравствуйте! Я ИИ-помощник Юлии, независимого амбассадора клуба путешествий Travel Club. Я не человек и не сотрудник компании. Спрашивайте о клубе и поездках.',note:'Тестовая версия: сообщения могут записываться для проверки. Не пишите личные данные.',ph:'Ваш вопрос',send:'Отправить',err:'Сейчас не получилось ответить. Напишите Юлии лично: @IuliiaZharkova.',close:'Закрыть'},
en:{btn:'Ask the AI assistant',title:"Julia's AI assistant",hello:"Hello! I am the AI assistant of Julia, an independent ambassador of the Travel Club travel club. I am not a human and not a company employee. Ask me about the club and trips.",note:'Test version: messages may be recorded for review. Please do not share personal data.',ph:'Your question',send:'Send',err:'Could not answer right now. Please message Julia directly: @IuliiaZharkova.',close:'Close'},
tr:{btn:'Yapay zekâ asistanına sor',title:"Julia'nın yapay zekâ asistanı",hello:"Merhaba! Ben, Travel Club seyahat kulübünün bağımsız elçisi Julia'nın yapay zekâ asistanıyım. İnsan değilim ve şirket çalışanı değilim. Kulüp ve geziler hakkında sorabilirsiniz.",note:'Test sürümü: mesajlar inceleme için kaydedilebilir. Lütfen kişisel veri yazmayın.',ph:'Sorunuz',send:'Gönder',err:'Şu anda yanıt verilemedi. Lütfen Julia’ya doğrudan yazın: @IuliiaZharkova.',close:'Kapat'}
}[L]||{};
var css='.aic-b{position:fixed;right:18px;bottom:18px;z-index:95;padding:13px 20px;border:0;border-radius:999px;background:#1389a3;color:#fff;font:600 15px Manrope,system-ui,sans-serif;cursor:pointer;box-shadow:0 14px 34px -12px rgba(0,50,80,.7)}'+
'.aic-p{position:fixed;right:18px;bottom:18px;z-index:96;width:min(380px,calc(100vw - 24px));height:min(560px,calc(100vh - 36px));display:none;flex-direction:column;background:#fff;color:#0b3b52;border-radius:20px;box-shadow:0 30px 70px -20px rgba(0,50,80,.6);font:500 15px/1.45 Manrope,system-ui,sans-serif;overflow:hidden}'+
'.aic-p.on{display:flex}.aic-h{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:#1389a3;color:#fff;font-weight:600}.aic-h button{background:none;border:0;color:#fff;font-size:22px;cursor:pointer}'+
'.aic-m{flex:1;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#f4fafc}.aic-m div{max-width:88%;padding:10px 13px;border-radius:14px;white-space:pre-wrap;word-wrap:break-word}.aic-a{background:#fff;border:1px solid #d6eaf0;align-self:flex-start}.aic-u{background:#1389a3;color:#fff;align-self:flex-end}'+
'.aic-n{padding:8px 14px;font-size:12.5px;color:#4b6b7a;background:#fff;border-top:1px solid #e1eef2}.aic-f{display:flex;gap:8px;padding:10px;border-top:1px solid #e1eef2;background:#fff}.aic-f input{flex:1;padding:11px 14px;border:1px solid #bcd9e2;border-radius:999px;font:inherit;outline:none}.aic-f button{padding:0 16px;border:0;border-radius:999px;background:#1389a3;color:#fff;font:600 14px inherit;cursor:pointer}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
var b=document.createElement('button');b.className='aic-b';b.type='button';b.textContent=T.btn;
var p=document.createElement('div');p.className='aic-p';p.setAttribute('role','dialog');p.setAttribute('aria-label',T.title);
p.innerHTML='<div class="aic-h"><span></span><button type="button" aria-label="">×</button></div><div class="aic-m"></div><div class="aic-n"></div><form class="aic-f"><input type="text" maxlength="600" autocomplete="off"><button type="submit"></button></form>';
document.body.appendChild(b);document.body.appendChild(p);
p.querySelector('.aic-h span').textContent=T.title;p.querySelector('.aic-h button').setAttribute('aria-label',T.close);
p.querySelector('.aic-n').textContent=T.note;var inp=p.querySelector('input');inp.placeholder=T.ph;p.querySelector('.aic-f button').textContent=T.send;
var box=p.querySelector('.aic-m'),hist=[],busy=false;
function add(c,t){var d=document.createElement('div');d.className=c;d.textContent=t;box.appendChild(d);box.scrollTop=box.scrollHeight;return d}
add('aic-a',T.hello);
b.onclick=function(){p.classList.add('on');b.style.display='none';inp.focus()};
p.querySelector('.aic-h button').onclick=function(){p.classList.remove('on');b.style.display=''};
p.querySelector('form').onsubmit=function(e){e.preventDefault();var q=inp.value.trim();if(!q||busy)return;inp.value='';add('aic-u',q);hist.push({role:'user',content:q});busy=true;var w=add('aic-a','…');
fetch(FN_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:hist.slice(-10)})}).then(function(r){return r.json()}).then(function(j){var a=j.reply||T.err;w.textContent=a;if(j.reply)hist.push({role:'assistant',content:a})}).catch(function(){w.textContent=T.err}).then(function(){busy=false;box.scrollTop=box.scrollHeight})};
})();
