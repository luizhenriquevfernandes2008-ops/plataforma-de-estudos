import {createContext,useContext} from 'react';
export type Appearance={mode:'light'|'dark';palette:'forest'|'rose'|'violet'|'ocean'|'amber';font:'system'|'arial'|'verdana'|'georgia'|'mono';textSize:'normal'|'large'|'larger';spacious:boolean;reducedMotion:boolean;dopamine:boolean;xp:boolean;missions:boolean;animations:boolean;rewardSound:boolean;garden:boolean;seenVersion:string};
export const defaults:Appearance={mode:'light',palette:'forest',font:'system',textSize:'normal',spacious:false,reducedMotion:false,dopamine:true,xp:true,missions:true,animations:true,rewardSound:false,garden:true,seenVersion:""};
export function normalizeAppearance(value:any):Appearance{
 const pick=<T extends string>(v:unknown,values:T[],fallback:T):T=>values.includes(v as T)?v as T:fallback;
 return {mode:pick(value?.mode,['light','dark'],'light'),palette:pick(value?.palette,['forest','rose','violet','ocean','amber'],'forest'),font:pick(value?.font,['system','arial','verdana','georgia','mono'],'system'),textSize:pick(value?.textSize,['normal','large','larger'],'normal'),spacious:value?.spacious===true,reducedMotion:value?.reducedMotion===true,dopamine:value?.dopamine!==false,xp:value?.xp!==false,missions:value?.missions!==false,animations:value?.animations!==false,rewardSound:value?.rewardSound===true,garden:value?.garden!==false,seenVersion:typeof value?.seenVersion==='string'?value.seenVersion:''};
}
export function applyAppearance(p:Appearance){const el=document.documentElement;Object.assign(el.dataset,{theme:p.mode,palette:p.palette,font:p.font,textSize:p.textSize,spacious:String(p.spacious),motion:p.reducedMotion?'reduced':'normal',dopamine:String(p.dopamine),xp:String(p.xp),missions:String(p.missions),animations:String(p.animations)});}
export const PreferencesContext=createContext<Appearance>(defaults);
export const useAppearance=()=>useContext(PreferencesContext);
