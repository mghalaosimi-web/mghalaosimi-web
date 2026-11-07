import {describe,it,expect} from "vitest";
import {readFileSync} from "node:fs";import {schemas} from "../src/schemas";describe("API validation contracts",()=>{it("rejects unsafe project slug",()=>expect(schemas.projects.safeParse({slug:"../x",name:"x",status:"Completed"}).success).toBe(false));it("rejects invalid project status",()=>expect(schemas.projects.safeParse({slug:"waynah",name:"WAYNAH",status:"published"}).success).toBe(false));it("rejects unknown fields",()=>expect(schemas.skills.safeParse({name:"React",category:"frontend",isAdmin:true}).success).toBe(false));it("accepts allowed status",()=>expect(schemas.projects.safeParse({slug:"waynah",name:"WAYNAH",status:"Experimental"}).success).toBe(true))});
describe("public social request contracts",()=>{
 const token="v".repeat(64);
 it("bounds visitor tokens and rejects unrequested identity fields",()=>{
  expect(schemas.publicVisitor.safeParse({visitorToken:token,path:"/projects/waynah/"}).success).toBe(true);
  expect(schemas.publicVisitor.safeParse({visitorToken:"v".repeat(129),path:"/"}).success).toBe(false);
  expect(schemas.publicVisitor.safeParse({visitorToken:token,email:"private@example.test"}).success).toBe(false);
 });
 it("requires explicit consent before a public name can be stored",()=>{
  expect(schemas.publicFollow.safeParse({visitorToken:token,displayName:"Visitor",consent:true}).success).toBe(true);
  expect(schemas.publicFollow.safeParse({visitorToken:token,displayName:"Visitor",consent:false}).success).toBe(false);
  expect(schemas.publicFollow.safeParse({visitorToken:token,displayName:"Visitor",consent:true,email:"private@example.test"}).success).toBe(false);
 });
 it("restricts reaction targets and payload fields",()=>{
  expect(schemas.publicReaction.safeParse({visitorToken:token,targetType:"project",targetId:"waynah",reaction:"like"}).success).toBe(true);
  expect(schemas.publicReaction.safeParse({visitorToken:token,targetType:"user",targetId:"waynah",reaction:"like"}).success).toBe(false);
  expect(schemas.publicReaction.safeParse({visitorToken:token,targetType:"project",targetId:"waynah",reaction:"like",email:"private@example.test"}).success).toBe(false);
 });
});
describe("public social client invariants",()=>{
 const source=readFileSync("../public/assets/social-engagement.js","utf8");
 it("does not infer email from browser identity or mailbox APIs",()=>{
  expect(source).not.toMatch(/navigator\\.email|localStorage\\.getItem\\(['"]email['"]\\)|document\\.cookie[^;]*email/i);
  expect(source).toContain("consent:consent.checked");
 });
 it("exposes accessible loading, pressed, status, and explanatory states",()=>{
  expect(source).toContain("aria-busy");
  expect(source).toContain("aria-pressed");
  expect(source).toContain("aria-describedby");
  expect(source).toContain("words.reactionHelp");
 });
 it("uses server-provided reaction counts",()=>{
  expect(source).toContain("data.counts.like");
  expect(source).toContain("data.counts.clap");
  expect(source).toContain("/api/public/reactions?");
 });
});
