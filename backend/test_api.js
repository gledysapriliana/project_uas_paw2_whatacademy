(async ()=>{
  const base = 'http://localhost:3000/api';
  try {
    console.log('Adding participant...');
    let res = await fetch(base + '/participants', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name:'Node Test', email:'node@test.com', phone:'081234'})
    });
    console.log('POST /participants', res.status);
    let body = await res.json();
    console.log(body);
    const id = body.participant?.id || body.participant?.id;
    console.log('New id:', id);
    console.log('Getting participants...');
    res = await fetch(base + '/participants');
    console.log('GET /participants', res.status);
    let list = await res.json();
    console.log('Count:', list.length);
    if (id) {
      console.log('GET /participants/'+id);
      res = await fetch(base + '/participants/'+id);
      console.log('status', res.status);
      console.log(await res.json());
      console.log('PUT /participants/'+id);
      res = await fetch(base + '/participants/'+id, {method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name:'Node Updated', email:'node2@test.com', phone:'0999'})});
      console.log('PUT status', res.status);
      console.log(await res.json());
      console.log('DELETE /participants/'+id);
      res = await fetch(base + '/participants/'+id, {method:'DELETE'});
      console.log('DELETE status', res.status);
      console.log(await res.json());
    }
  } catch (e) { console.error('ERR', e); }
})();