import test from 'node:test';
import assert from 'node:assert/strict';
import apiHandler from '../../api-handler.mjs';

class FakeStatement {
  constructor(db,sql,params=[]){this.db=db;this.sql=sql;this.params=params}
  bind(...params){return new FakeStatement(this.db,this.sql,params)}
  async run(){
    this.db.calls.push({sql:this.sql,params:this.params});
    if(this.sql.includes('INSERT INTO contact_messages'))this.db.messages.push(this.params);
    return {success:true,meta:{changes:1}};
  }
  async first(){
    if(this.sql.includes('SELECT value_json FROM site_settings')){
      const key=String(this.params[0]||'');
      return {value_json:key.startsWith('rl:contact:')?String(this.db.contactAttempts):'1'};
    }
    return null;
  }
  async all(){return {success:true,results:[],meta:{changes:0}}}
}
class FakeDatabase {
  constructor({contactAttempts=1}={}){this.contactAttempts=contactAttempts;this.messages=[];this.calls=[]}
  prepare(sql){return new FakeStatement(this,sql)}
  async batch(){return []}
}
function request(payload){
  return new Request('https://mghalaosimi-web.vercel.app/api/public/contact-messages',{
    method:'POST',
    headers:{'content-type':'application/json','origin':'https://mghalaosimi-web.vercel.app','x-client-ip':'203.0.113.9','user-agent':'contact-api-test'},
    body:JSON.stringify(payload)
  });
}
const valid={name:'Test Sender',email:'TEST@example.com',subject:'Project inquiry',message:'This is a synthetic message for an isolated API test.',locale:'en',website:'',consent:true};
function environment(DB){return {DB,ALLOWED_ORIGINS:'https://mghalaosimi-web.vercel.app',RATE_LIMIT_PER_MINUTE:'120'}}

test('stores a valid consented message and normalizes the sender email',async()=>{
  const DB=new FakeDatabase();
  const response=await apiHandler.fetch(request(valid),environment(DB));
  const body=await response.json();
  assert.equal(response.status,201);
  assert.equal(body.success,true);
  assert.equal(DB.messages.length,1);
  assert.equal(DB.messages[0][2],'test@example.com');
  assert.equal(DB.calls.some(x=>x.sql.includes('INSERT INTO contact_messages')),true);
  assert.equal(DB.calls.some(x=>x.sql.includes('ip_hash')||x.sql.includes('user_agent')),false);
});

test('rejects submissions without explicit consent',async()=>{
  const DB=new FakeDatabase();
  const response=await apiHandler.fetch(request({...valid,consent:false}),environment(DB));
  assert.equal(response.status,400);
  assert.equal(DB.messages.length,0);
});

test('silently accepts but does not store honeypot submissions',async()=>{
  const DB=new FakeDatabase();
  const response=await apiHandler.fetch(request({...valid,website:'bot-filled'}),environment(DB));
  assert.equal(response.status,201);
  assert.equal(DB.messages.length,0);
});

test('throttles more than three contact submissions per ten-minute IP window',async()=>{
  const DB=new FakeDatabase({contactAttempts:4});
  const response=await apiHandler.fetch(request(valid),environment(DB));
  const body=await response.json();
  assert.equal(response.status,429);
  assert.equal(body.error.code,'CONTACT_RATE_LIMITED');
  assert.equal(DB.messages.length,0);
});
