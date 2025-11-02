let customerName = null;

function toggleChat(){
  const box = document.getElementById('chatbot');
  box.style.display = (box.style.display === 'flex') ? 'none' : 'flex';
}

function appendMsg(text, sender='bot'){
  const body = document.getElementById('chat-body');
  const div = document.createElement('div');
  div.className = 'msg ' + sender;
  div.innerHTML = text;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function sendMessage(){
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if(!text) return;
  appendMsg(text, 'user');
  input.value = '';
  handleAI(text);
}

function handleAI(text){
  const lower = text.toLowerCase();
  if(!customerName){
    customerName = text.replace(/[^a-zA-Z\s]/g,'').trim();
    appendMsg('Nice to meet you, <b>'+customerName+'</b> 👋. You can ask about: services, price, Dhofar areas, 24/7, booking.');
    return;
  }
  if(lower.includes('service')){
    appendMsg('We provide: cleaning, AC maintenance, plumbing, electrical, painting & décor, CCTV/smart home, car wash, gardening, and ladies home salon – inside Dhofar.');
  }else if(lower.includes('price') || lower.includes('how much')){
    appendMsg('Prices start from <b>5–10 OMR</b> for small jobs and <b>15–25 OMR</b> for AC / electrical / plumbing. Final price depends on the area and technician.');
  }else if(lower.includes('area') || lower.includes('where')){
    appendMsg('We currently serve: Salalah, Taqah, Mirbat, Thumrait, Rakhyut, Dhalkut, and nearby places in Dhofar.');
  }else if(lower.includes('24') || lower.includes('available') || lower.includes('time')){
    appendMsg('Yes ✅ we accept requests 24/7. Technician visit depends on availability and your selected time.');
  }else if(lower.includes('book') || lower.includes('register')){
    appendMsg('To book: fill the form at the bottom, choose service + area + date/time. You will see a success message and admin will get your details.');
  }else{
    appendMsg('Thank you, '+customerName+'. I can help you with services, prices, Dhofar areas, 24/7, or how to book.');
  }
}

// booking
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('booking-form');
  if(form){
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());
      data.createdAt = new Date().toISOString();

      // save to cloud (demo)
      if(typeof saveToFirebase === 'function'){
        try{ await saveToFirebase(data); }catch(err){ console.warn(err); }
      }

      // send emailjs (needs real service/template IDs)
      try{
        await emailjs.send('service_dhofarcare','template_booking',{
          to_email: 'sharooqalmashani1@gmail.com',
          user_name: data.name,
          user_email: data.email,
          user_phone: data.phone,
          user_area: data.area,
          user_service: data.service,
          user_datetime: data.datetime,
          user_notes: data.notes || ''
        });
      }catch(err){
        console.warn('EmailJS not configured yet', err);
      }

      document.getElementById('success-modal').classList.remove('hidden');
      form.reset();
      appendMsg('✅ Your booking was received. Our team will check technician availability and confirm.', 'bot');
    });
  }
});

function closeModal(){
  document.getElementById('success-modal').classList.add('hidden');
}
