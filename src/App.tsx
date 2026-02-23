import { useState, useMemo } from "react";

const C = {
  bg:"#F8F7F4",white:"#FFFFFF",dark:"#1C1C1E",darkMid:"#3A3A3C",muted:"#8A8A8E",
  border:"#E5E5EA",borderDark:"#D1D1D6",
  primary:"#1B6B6B",primaryLight:"#E8F4F4",primaryBorder:"#B8D8D8",
  gold:"#B8902A",goldLight:"#FDF6E3",goldBorder:"#E8D49A",
  green:"#1A7A3A",greenLight:"#E8F5EE",greenBorder:"#A8D8B8",
  red:"#C0392B",redLight:"#FDF0EE",redBorder:"#E8B4AE",
  orange:"#D4660A",orangeLight:"#FEF3E8",orangeBorder:"#F0C898",
};

const APIS_INIT = [
  {id:1,nombre:"Hydroquinone USP",cat:"Dermatológico",stock:450,min:100,unidad:"g",proveedor:"PCCA",lote:"HQ-2024-08",recibo:"2024-08-10",vence:"2026-08-15",costo:0.28},
  {id:2,nombre:"Tretinoin USP",cat:"Dermatológico",stock:12,min:20,unidad:"g",proveedor:"Fagron",lote:"TR-2024-11",recibo:"2024-11-05",vence:"2026-11-30",costo:4.50},
  {id:3,nombre:"Azelaic Acid USP",cat:"Dermatológico",stock:320,min:80,unidad:"g",proveedor:"PCCA",lote:"AZ-2025-01",recibo:"2025-01-15",vence:"2027-01-20",costo:0.15},
  {id:4,nombre:"Salicylic Acid USP",cat:"Dermatológico",stock:280,min:100,unidad:"g",proveedor:"Medisca",lote:"SA-2024-09",recibo:"2024-09-20",vence:"2026-09-10",costo:0.08},
  {id:5,nombre:"Ivermectin",cat:"Antiparasitario",stock:8,min:15,unidad:"g",proveedor:"PCCA",lote:"IV-2024-12",recibo:"2024-12-01",vence:"2026-12-05",costo:12.00},
  {id:6,nombre:"Fluocinolone USP",cat:"Corticoesteroide",stock:35,min:25,unidad:"g",proveedor:"Fagron",lote:"FL-2025-02",recibo:"2025-02-10",vence:"2027-02-28",costo:1.80},
  {id:7,nombre:"Progesterone USP",cat:"Hormonal",stock:180,min:50,unidad:"g",proveedor:"PCCA",lote:"PG-2024-10",recibo:"2024-10-12",vence:"2026-10-15",costo:0.95},
  {id:8,nombre:"Celulosa USP",cat:"Excipiente",stock:900,min:200,unidad:"g",proveedor:"Medisca",lote:"CE-2025-01",recibo:"2025-01-05",vence:"2028-01-01",costo:0.04},
  {id:9,nombre:"Loxoral USP",cat:"Excipiente",stock:420,min:150,unidad:"g",proveedor:"PCCA",lote:"LX-2024-11",recibo:"2024-11-18",vence:"2027-11-20",costo:0.12},
  {id:10,nombre:"Biotin USP",cat:"Nutracéutico",stock:95,min:30,unidad:"g",proveedor:"Medisca",lote:"BT-2025-03",recibo:"2025-03-01",vence:"2027-03-15",costo:0.65},
  {id:11,nombre:"Finasteride USP",cat:"Hormonal",stock:22,min:20,unidad:"g",proveedor:"Fagron",lote:"FN-2024-12",recibo:"2024-12-15",vence:"2026-12-31",costo:3.20},
  {id:12,nombre:"Minoxidil USP",cat:"Capilar",stock:145,min:40,unidad:"g",proveedor:"PCCA",lote:"MX-2025-01",recibo:"2025-01-22",vence:"2027-01-10",costo:0.85},
];

// Fórmulas maestras — cantidadBase = tamaño base de la fórmula
const FORMULAS_INIT = [
  {id:1,nombre:"Crema Hidroquinona 4%",categoria:"Dermatológico",descripcion:"Crema despigmentante estándar",cantidadBase:30,unidadBase:"g",
   ingredientes:[{apiId:1,nombre:"Hydroquinone USP",cantidad:1.2,unidad:"g"},{apiId:9,nombre:"Loxoral USP",cantidad:28.8,unidad:"g"}]},
  {id:2,nombre:"Crema Tretinoína 0.025%",categoria:"Dermatológico",descripcion:"Anti-aging suave",cantidadBase:30,unidadBase:"g",
   ingredientes:[{apiId:2,nombre:"Tretinoin USP",cantidad:0.0075,unidad:"g"},{apiId:9,nombre:"Loxoral USP",cantidad:29.9925,unidad:"g"}]},
  {id:3,nombre:"Crema Tretinoína 0.05%",categoria:"Dermatológico",descripcion:"Anti-aging moderado",cantidadBase:30,unidadBase:"g",
   ingredientes:[{apiId:2,nombre:"Tretinoin USP",cantidad:0.015,unidad:"g"},{apiId:9,nombre:"Loxoral USP",cantidad:29.985,unidad:"g"}]},
  {id:4,nombre:"Triple Blend HQ4+Tret0.025+Fluo",categoria:"Dermatológico",descripcion:"Fórmula Kligman modificada",cantidadBase:30,unidadBase:"g",
   ingredientes:[{apiId:1,nombre:"Hydroquinone USP",cantidad:1.2,unidad:"g"},{apiId:2,nombre:"Tretinoin USP",cantidad:0.0075,unidad:"g"},{apiId:6,nombre:"Fluocinolone USP",cantidad:0.003,unidad:"g"},{apiId:9,nombre:"Loxoral USP",cantidad:28.7895,unidad:"g"}]},
  {id:5,nombre:"Crema Azelaic Acid 20%",categoria:"Dermatológico",descripcion:"Rosácea y pigmentación",cantidadBase:30,unidadBase:"g",
   ingredientes:[{apiId:3,nombre:"Azelaic Acid USP",cantidad:6.0,unidad:"g"},{apiId:9,nombre:"Loxoral USP",cantidad:24.0,unidad:"g"}]},
  {id:6,nombre:"Crema Ivermectin 1%",categoria:"Antiparasitario",descripcion:"Rosácea / Demodex",cantidadBase:30,unidadBase:"g",
   ingredientes:[{apiId:5,nombre:"Ivermectin",cantidad:0.3,unidad:"g"},{apiId:9,nombre:"Loxoral USP",cantidad:29.7,unidad:"g"}]},
  {id:7,nombre:"Solución Minoxidil 5%",categoria:"Capilar",descripcion:"Alopecia androgenética",cantidadBase:60,unidadBase:"ml",
   ingredientes:[{apiId:12,nombre:"Minoxidil USP",cantidad:3.0,unidad:"g"},{apiId:9,nombre:"Loxoral USP",cantidad:57.0,unidad:"ml"}]},
  {id:8,nombre:"Solución Minoxidil 10%",categoria:"Capilar",descripcion:"Alopecia severa",cantidadBase:60,unidadBase:"ml",
   ingredientes:[{apiId:12,nombre:"Minoxidil USP",cantidad:6.0,unidad:"g"},{apiId:9,nombre:"Loxoral USP",cantidad:54.0,unidad:"ml"}]},
  {id:9,nombre:"Cápsulas Progesterona 100mg",categoria:"Hormonal",descripcion:"TRH femenina",cantidadBase:30,unidadBase:"cáps",
   ingredientes:[{apiId:7,nombre:"Progesterone USP",cantidad:3.0,unidad:"g"},{apiId:8,nombre:"Celulosa USP",cantidad:6.0,unidad:"g"}]},
  {id:10,nombre:"Cápsulas Finasteride 1mg",categoria:"Hormonal",descripcion:"Alopecia androgenética",cantidadBase:30,unidadBase:"cáps",
   ingredientes:[{apiId:11,nombre:"Finasteride USP",cantidad:0.03,unidad:"g"},{apiId:8,nombre:"Celulosa USP",cantidad:6.0,unidad:"g"}]},
];

const HISTORIAL_INIT = [
  {id:1,tipo:"uso",apiId:2,api:"Tretinoin USP",cantidad:0.015,unidad:"g",prep:"Crema Tretinoína 0.05% 30g",tecnico:"Carmen L.",fecha:"2026-02-21",orden:"FM-001"},
  {id:2,tipo:"uso",apiId:7,api:"Progesterone USP",cantidad:3.0,unidad:"g",prep:"Cápsulas Progesterona 100mg x30",tecnico:"Miguel R.",fecha:"2026-02-21",orden:"FM-002"},
  {id:3,tipo:"uso",apiId:1,api:"Hydroquinone USP",cantidad:1.2,unidad:"g",prep:"Crema Hidroquinona 4% 30g",tecnico:"Carmen L.",fecha:"2026-02-20",orden:"FM-003"},
  {id:4,tipo:"entrada",apiId:12,api:"Minoxidil USP",cantidad:50,unidad:"g",prep:"—",tecnico:"Admin",fecha:"2026-02-19",orden:"Recepción PCCA"},
];

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────
const Card=({children,style})=><div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:24,boxShadow:"0 1px 4px rgba(0,0,0,0.06)",...style}}>{children}</div>;
const SLabel=({children})=><div style={{fontSize:10,fontWeight:700,letterSpacing:"1.5px",color:C.muted,textTransform:"uppercase",marginBottom:6,fontFamily:"sans-serif"}}>{children}</div>;
const FInput=({label,value,onChange,placeholder,type="text",required,style:st={}})=>(
  <div style={{marginBottom:14}}>
    {label&&<SLabel>{label}{required&&<span style={{color:C.red}}> *</span>}</SLabel>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{width:"100%",padding:"10px 12px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.dark,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"sans-serif",...st}}
      onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.border}/>
  </div>
);
const Btn=({children,onClick,color=C.primary,variant="solid",size="md",style:st,disabled})=>{
  const pad=size==="sm"?"7px 14px":size==="lg"?"13px 28px":"10px 20px";
  return <button onClick={onClick} disabled={disabled} style={{padding:pad,fontSize:size==="sm"?12:size==="lg"?15:13,fontWeight:600,borderRadius:8,cursor:disabled?"not-allowed":"pointer",border:variant==="outline"?`1px solid ${color}`:"none",background:variant==="outline"?"transparent":disabled?C.border:color,color:variant==="outline"?color:disabled?C.muted:"#fff",fontFamily:"sans-serif",transition:"all 0.15s",opacity:disabled?0.6:1,...st}}>{children}</button>;
};
const Badge=({children,color=C.primary,bg})=><span style={{display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:bg||`${color}18`,color,border:`1px solid ${color}30`,fontFamily:"sans-serif"}}>{children}</span>;
const StatusBadge=({api})=>{
  if(api.stock===0)return<Badge color={C.red} bg={C.redLight}>SIN STOCK</Badge>;
  if(api.stock<api.min)return<Badge color={C.red} bg={C.redLight}>⚠ CRÍTICO</Badge>;
  if(api.stock<api.min*1.5)return<Badge color={C.orange} bg={C.orangeLight}>BAJO</Badge>;
  return<Badge color={C.green} bg={C.greenLight}>OK</Badge>;
};
const StockBar=({api})=>{
  const pct=Math.min(100,(api.stock/(api.min*3))*100);
  const color=api.stock<api.min?C.red:api.stock<api.min*1.5?C.orange:C.green;
  return<div style={{height:5,background:C.border,borderRadius:3,overflow:"hidden",marginTop:6}}><div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:3,transition:"width 0.4s"}}/></div>;
};
const Modal=({children,onClose,wide})=>(
  <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div onClick={e=>e.stopPropagation()} style={{background:C.white,borderRadius:16,padding:28,width:"100%",maxWidth:wide?800:520,boxShadow:"0 20px 60px rgba(0,0,0,0.2)",maxHeight:"92vh",overflowY:"auto"}}>{children}</div>
  </div>
);

// ═══════════ DASHBOARD ═══════════
const Dashboard=({apis,historial})=>{
  const criticos=apis.filter(a=>a.stock<a.min);
  const bajos=apis.filter(a=>a.stock>=a.min&&a.stock<a.min*1.5);
  const valorTotal=apis.reduce((acc,a)=>acc+(a.stock*a.costo),0);
  return(
    <div>
      <div style={{marginBottom:28}}><h2 style={{margin:0,fontSize:24,fontWeight:700,color:C.dark,fontFamily:"sans-serif"}}>Dashboard</h2><p style={{margin:"6px 0 0",fontSize:14,color:C.muted,fontFamily:"sans-serif"}}>Estado del inventario en tiempo real · Farmacia Mía+</p></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",gap:14,marginBottom:28}}>
        {[{label:"APIs en Inventario",value:apis.length,icon:"🧪",color:C.primary,bg:C.primaryLight},{label:"Stock Crítico",value:criticos.length,icon:"🚨",color:C.red,bg:C.redLight},{label:"Stock Bajo",value:bajos.length,icon:"⚠️",color:C.orange,bg:C.orangeLight},{label:"Valor Inventario",value:`$${valorTotal.toFixed(0)}`,icon:"💰",color:C.gold,bg:C.goldLight},{label:"Movimientos",value:historial.length,icon:"📋",color:C.green,bg:C.greenLight}].map(s=>(
          <Card key={s.label} style={{padding:16,display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:46,height:46,borderRadius:10,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{s.icon}</div>
            <div><div style={{fontSize:22,fontWeight:700,color:s.color,fontFamily:"sans-serif",lineHeight:1}}>{s.value}</div><div style={{fontSize:11,color:C.muted,fontFamily:"sans-serif",marginTop:4}}>{s.label}</div></div>
          </Card>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <Card>
          <div style={{fontSize:15,fontWeight:700,color:C.dark,marginBottom:14,fontFamily:"sans-serif"}}>🚨 Alertas de Stock</div>
          {criticos.length===0&&bajos.length===0?<div style={{fontSize:14,color:C.green,fontFamily:"sans-serif"}}>✅ Todo el inventario está bien</div>:[...criticos,...bajos].map(a=>(
            <div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
              <div><div style={{fontSize:13,fontWeight:600,color:C.dark,fontFamily:"sans-serif"}}>{a.nombre}</div><div style={{fontSize:11,color:C.muted,fontFamily:"sans-serif"}}>Stock: {a.stock}{a.unidad} · Mín: {a.min}{a.unidad}</div></div>
              <StatusBadge api={a}/>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{fontSize:15,fontWeight:700,color:C.dark,marginBottom:14,fontFamily:"sans-serif"}}>🕐 Últimos Movimientos</div>
          {historial.slice(0,6).map(h=>(
            <div key={h.id} style={{padding:"9px 0",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
              <div><div style={{fontSize:12,fontWeight:600,color:C.dark,fontFamily:"sans-serif"}}>{h.api}</div><div style={{fontSize:11,color:C.muted,fontFamily:"sans-serif"}}>{h.prep!=="—"?h.prep:h.orden} · {h.tecnico}</div></div>
              <div style={{textAlign:"right",flexShrink:0,marginLeft:10}}><div style={{fontSize:13,fontWeight:700,color:h.tipo==="entrada"?C.green:C.red,fontFamily:"sans-serif"}}>{h.tipo==="entrada"?"+":"−"}{h.cantidad}{h.unidad}</div><div style={{fontSize:10,color:C.muted,fontFamily:"sans-serif"}}>{h.fecha}</div></div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

// ═══════════ INVENTARIO ═══════════
const Inventario=({apis,setApis,historial,setHistorial})=>{
  const [busqueda,setBusqueda]=useState("");
  const [catFiltro,setCatFiltro]=useState("Todas");
  const [statusFiltro,setStatusFiltro]=useState("Todos");
  const [modalRecibir,setModalRecibir]=useState(false);
  const [modalAjuste,setModalAjuste]=useState(null);
  const [nuevo,setNuevo]=useState({nombre:"",selId:"",cantidad:"",unidad:"g",min:"",proveedor:"",lote:"",recibo:"",vence:"",costo:"",cat:""});
  const [ajusteCant,setAjusteCant]=useState("");
  const [ajusteTipo,setAjusteTipo]=useState("entrada");

  const categorias=["Todas",...new Set(apis.map(a=>a.cat))];
  const filtrados=useMemo(()=>apis.filter(a=>{
    const q=busqueda.toLowerCase();
    const mQ=!q||a.nombre.toLowerCase().includes(q)||a.proveedor.toLowerCase().includes(q);
    const mC=catFiltro==="Todas"||a.cat===catFiltro;
    const mS=statusFiltro==="Todos"||(statusFiltro==="critico"&&a.stock<a.min)||(statusFiltro==="bajo"&&a.stock>=a.min&&a.stock<a.min*1.5)||(statusFiltro==="ok"&&a.stock>=a.min*1.5);
    return mQ&&mC&&mS;
  }),[apis,busqueda,catFiltro,statusFiltro]);

  const selApi=nuevo.selId?apis.find(a=>a.id===parseInt(nuevo.selId)):null;

  const confirmarRecibo=()=>{
    const cant=parseFloat(nuevo.cantidad)||0;
    const hoy=new Date().toISOString().split("T")[0];
    if(selApi){
      setApis(apis.map(a=>a.id===selApi.id?{...a,stock:a.stock+cant,lote:nuevo.lote||a.lote,vence:nuevo.vence||a.vence,recibo:nuevo.recibo||a.recibo,proveedor:nuevo.proveedor||a.proveedor}:a));
      setHistorial([{id:historial.length+1,tipo:"entrada",apiId:selApi.id,api:selApi.nombre,cantidad:cant,unidad:selApi.unidad,prep:"—",tecnico:"Admin",fecha:nuevo.recibo||hoy,orden:`Recepción ${nuevo.proveedor||selApi.proveedor}`},...historial]);
    } else {
      const id=Math.max(...apis.map(a=>a.id))+1;
      const n={id,nombre:nuevo.nombre,cat:nuevo.cat||"General",stock:cant,min:parseFloat(nuevo.min)||10,unidad:nuevo.unidad,proveedor:nuevo.proveedor,lote:nuevo.lote,recibo:nuevo.recibo||hoy,vence:nuevo.vence,costo:parseFloat(nuevo.costo)||0};
      setApis([...apis,n]);
      setHistorial([{id:historial.length+1,tipo:"entrada",apiId:id,api:nuevo.nombre,cantidad:cant,unidad:nuevo.unidad,prep:"—",tecnico:"Admin",fecha:nuevo.recibo||hoy,orden:`Recepción ${nuevo.proveedor}`},...historial]);
    }
    setModalRecibir(false);
    setNuevo({nombre:"",selId:"",cantidad:"",unidad:"g",min:"",proveedor:"",lote:"",recibo:"",vence:"",costo:"",cat:""});
  };

  const aplicarAjuste=()=>{
    const cant=parseFloat(ajusteCant);if(!cant||!modalAjuste)return;
    const nuevo2=Math.max(0,modalAjuste.stock+(ajusteTipo==="entrada"?cant:-cant));
    setApis(apis.map(a=>a.id===modalAjuste.id?{...a,stock:nuevo2}:a));
    setHistorial([{id:historial.length+1,tipo:ajusteTipo,apiId:modalAjuste.id,api:modalAjuste.nombre,cantidad:cant,unidad:modalAjuste.unidad,prep:"Ajuste manual",tecnico:"Admin",fecha:new Date().toISOString().split("T")[0],orden:"Ajuste"},...historial]);
    setModalAjuste(null);setAjusteCant("");
  };

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div><h2 style={{margin:0,fontSize:24,fontWeight:700,color:C.dark,fontFamily:"sans-serif"}}>Inventario de APIs</h2><p style={{margin:"6px 0 0",fontSize:14,color:C.muted,fontFamily:"sans-serif"}}>{filtrados.length} ingredientes activos</p></div>
        <Btn onClick={()=>setModalRecibir(true)} color={C.green} size="lg">📦 Recibir API / Ingrediente</Btn>
      </div>
      <Card style={{marginBottom:16,padding:14}}>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
          <input value={busqueda} onChange={e=>setBusqueda(e.target.value)} placeholder="🔍 Buscar API o proveedor..." style={{flex:1,minWidth:200,padding:"10px 14px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.dark,fontSize:14,outline:"none",fontFamily:"sans-serif"}} onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.border}/>
          <select value={catFiltro} onChange={e=>setCatFiltro(e.target.value)} style={{padding:"10px 14px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.dark,fontSize:13,outline:"none",fontFamily:"sans-serif"}}>{categorias.map(c=><option key={c}>{c}</option>)}</select>
          {["Todos","critico","bajo","ok"].map(s=><button key={s} onClick={()=>setStatusFiltro(s)} style={{padding:"9px 14px",borderRadius:8,fontFamily:"sans-serif",fontSize:12,fontWeight:600,cursor:"pointer",background:statusFiltro===s?C.primary:C.bg,color:statusFiltro===s?"#fff":C.muted,border:`1px solid ${statusFiltro===s?C.primary:C.border}`}}>{s==="Todos"?"Todos":s==="critico"?"🚨 Crítico":s==="bajo"?"⚠️ Bajo":"✅ OK"}</button>)}
        </div>
      </Card>
      <Card style={{padding:0,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:C.bg,borderBottom:`1px solid ${C.border}`}}>{["API / Ingrediente","Cat","Stock","Mínimo","Proveedor","Lote · Recibo · Vence","Estado",""].map(h=><th key={h} style={{padding:"11px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,letterSpacing:"1px",textTransform:"uppercase",fontFamily:"sans-serif",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
          <tbody>{filtrados.map((a,i)=>(
            <tr key={a.id} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?C.white:C.bg}}>
              <td style={{padding:"13px 14px"}}><div style={{fontSize:13,fontWeight:600,color:C.dark,fontFamily:"sans-serif"}}>{a.nombre}</div><div style={{fontSize:11,color:C.muted,fontFamily:"sans-serif"}}>${a.costo.toFixed(2)}/{a.unidad}</div></td>
              <td style={{padding:"13px 14px"}}><Badge color={C.primary}>{a.cat}</Badge></td>
              <td style={{padding:"13px 14px"}}><div style={{fontSize:15,fontWeight:700,color:a.stock<a.min?C.red:a.stock<a.min*1.5?C.orange:C.dark,fontFamily:"sans-serif"}}>{a.stock} {a.unidad}</div><StockBar api={a}/></td>
              <td style={{padding:"13px 14px",fontSize:12,color:C.muted,fontFamily:"sans-serif"}}>{a.min} {a.unidad}</td>
              <td style={{padding:"13px 14px",fontSize:12,color:C.darkMid,fontFamily:"sans-serif"}}>{a.proveedor}</td>
              <td style={{padding:"13px 14px"}}><div style={{fontSize:11,color:C.darkMid,fontFamily:"sans-serif"}}>{a.lote}</div><div style={{fontSize:11,color:C.muted,fontFamily:"sans-serif"}}>Recibo: {a.recibo}</div><div style={{fontSize:11,color:new Date(a.vence)<new Date(Date.now()+90*24*60*60*1000)?C.orange:C.muted,fontFamily:"sans-serif"}}>Vence: {a.vence}</div></td>
              <td style={{padding:"13px 14px"}}><StatusBadge api={a}/></td>
              <td style={{padding:"13px 14px"}}><Btn onClick={()=>{setModalAjuste(a);setAjusteTipo("entrada");setAjusteCant("");}} size="sm">Ajustar</Btn></td>
            </tr>
          ))}</tbody>
        </table>
      </Card>

      {/* MODAL RECIBIR */}
      {modalRecibir&&(
        <Modal onClose={()=>setModalRecibir(false)} wide>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
            <div><div style={{fontSize:18,fontWeight:700,color:C.dark,fontFamily:"sans-serif"}}>📦 Recibir API / Ingrediente</div><div style={{fontSize:13,color:C.muted,fontFamily:"sans-serif",marginTop:4}}>Selecciona un API existente para sumar stock, o agrega uno nuevo.</div></div>
            <button onClick={()=>setModalRecibir(false)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.muted}}>✕</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div style={{gridColumn:"1/-1"}}>
              <SLabel>API existente (para sumar stock)</SLabel>
              <select value={nuevo.selId} onChange={e=>{const a=apis.find(x=>x.id===parseInt(e.target.value));setNuevo({...nuevo,selId:e.target.value,unidad:a?.unidad||"g"});}} style={{width:"100%",padding:"11px 14px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.dark,fontSize:14,outline:"none",fontFamily:"sans-serif",marginBottom:8}}>
                <option value="">— O agregar API nuevo abajo —</option>
                {apis.map(a=><option key={a.id} value={a.id}>{a.nombre} (Stock actual: {a.stock}{a.unidad})</option>)}
              </select>
              {!nuevo.selId&&<FInput label="Nombre del nuevo API *" value={nuevo.nombre} onChange={v=>setNuevo({...nuevo,nombre:v})} placeholder="Ej: Ketoconazol USP"/>}
            </div>
            <div>
              <SLabel>Cantidad recibida *</SLabel>
              <input type="number" value={nuevo.cantidad} onChange={e=>setNuevo({...nuevo,cantidad:e.target.value})} placeholder="0.00" style={{width:"100%",padding:"10px 12px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.dark,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"sans-serif"}}/>
            </div>
            <div>
              <SLabel>Unidad</SLabel>
              <select value={nuevo.unidad} onChange={e=>setNuevo({...nuevo,unidad:e.target.value})} style={{width:"100%",padding:"11px 14px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.dark,fontSize:14,outline:"none",fontFamily:"sans-serif"}}>
                {["g","mg","ml","kg","L","oz","u"].map(u=><option key={u}>{u}</option>)}
              </select>
            </div>
            <div style={{gridColumn:"1/-1",height:1,background:C.border,margin:"4px 0"}}/>
            <FInput label="Fecha de recibo *" value={nuevo.recibo} onChange={v=>setNuevo({...nuevo,recibo:v})} type="date" required/>
            <FInput label="Fecha de expiración *" value={nuevo.vence} onChange={v=>setNuevo({...nuevo,vence:v})} type="date" required/>
            <FInput label="Suplidor / Proveedor *" value={nuevo.proveedor} onChange={v=>setNuevo({...nuevo,proveedor:v})} placeholder="PCCA, Fagron, Medisca..." required/>
            <FInput label="Número de lote" value={nuevo.lote} onChange={v=>setNuevo({...nuevo,lote:v})} placeholder="LOT-2025-001"/>
            {!nuevo.selId&&<>
              <FInput label="Categoría" value={nuevo.cat} onChange={v=>setNuevo({...nuevo,cat:v})} placeholder="Dermatológico, Hormonal..."/>
              <FInput label="Stock mínimo" value={nuevo.min} onChange={v=>setNuevo({...nuevo,min:v})} placeholder="20" type="number"/>
              <FInput label="Costo por unidad ($)" value={nuevo.costo} onChange={v=>setNuevo({...nuevo,costo:v})} placeholder="0.00" type="number"/>
            </>}
            {selApi&&(
              <div style={{gridColumn:"1/-1",padding:"12px 16px",background:C.greenLight,borderRadius:10,border:`1px solid ${C.greenBorder}`}}>
                <div style={{fontSize:13,color:C.green,fontFamily:"sans-serif",fontWeight:600}}>Stock actual: {selApi.stock}{selApi.unidad} → Nuevo: {selApi.stock+(parseFloat(nuevo.cantidad)||0)}{selApi.unidad}</div>
              </div>
            )}
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16}}>
            <Btn onClick={()=>setModalRecibir(false)} variant="outline" color={C.muted}>Cancelar</Btn>
            <Btn onClick={confirmarRecibo} disabled={!nuevo.cantidad||!nuevo.recibo||!nuevo.vence||(!nuevo.selId&&!nuevo.nombre)} color={C.green} size="lg">✅ Confirmar Recepción</Btn>
          </div>
        </Modal>
      )}

      {/* MODAL AJUSTE */}
      {modalAjuste&&(
        <Modal onClose={()=>setModalAjuste(null)}>
          <div style={{fontSize:17,fontWeight:700,color:C.dark,marginBottom:4,fontFamily:"sans-serif"}}>Ajustar Stock Manual</div>
          <div style={{fontSize:13,color:C.muted,marginBottom:18,fontFamily:"sans-serif"}}>{modalAjuste.nombre}</div>
          <div style={{display:"flex",gap:10,marginBottom:18}}>
            {[["entrada","📦 Entrada",C.green],["salida","⬆️ Uso/Salida",C.red]].map(([val,label,color])=>(
              <button key={val} onClick={()=>setAjusteTipo(val)} style={{flex:1,padding:"11px 8px",borderRadius:10,border:`2px solid ${ajusteTipo===val?color:C.border}`,background:ajusteTipo===val?`${color}15`:"transparent",color:ajusteTipo===val?color:C.muted,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"sans-serif"}}>{label}</button>
            ))}
          </div>
          <div style={{padding:"12px 16px",background:C.bg,borderRadius:10,marginBottom:14,display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:13,color:C.muted,fontFamily:"sans-serif"}}>Stock actual</span>
            <span style={{fontSize:16,fontWeight:700,color:C.dark,fontFamily:"sans-serif"}}>{modalAjuste.stock} {modalAjuste.unidad}</span>
          </div>
          <FInput label={`Cantidad (${modalAjuste.unidad})`} value={ajusteCant} onChange={setAjusteCant} placeholder="0.00" type="number"/>
          {ajusteCant&&<div style={{padding:"11px 14px",background:ajusteTipo==="entrada"?C.greenLight:C.redLight,borderRadius:10,marginBottom:14}}><span style={{fontSize:13,color:C.muted,fontFamily:"sans-serif"}}>Nuevo stock: </span><span style={{fontSize:16,fontWeight:700,color:ajusteTipo==="entrada"?C.green:C.red,fontFamily:"sans-serif"}}>{Math.max(0,modalAjuste.stock+(ajusteTipo==="entrada"?parseFloat(ajusteCant)||0:-(parseFloat(ajusteCant)||0)))} {modalAjuste.unidad}</span></div>}
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn onClick={()=>setModalAjuste(null)} variant="outline" color={C.muted}>Cancelar</Btn>
            <Btn onClick={aplicarAjuste} disabled={!ajusteCant} color={ajusteTipo==="entrada"?C.green:C.red}>Confirmar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ═══════════ PREPARAR FÓRMULA ═══════════
const PrepararFormula=({apis,setApis,historial,setHistorial,formulas})=>{
  const [formulaId,setFormulaId]=useState("");
  const [cantidad,setCantidad]=useState("");
  const [orden,setOrden]=useState("");
  const [tecnico,setTecnico]=useState("");
  const [paso,setPaso]=useState(1);

  const formula=formulas.find(f=>f.id===parseInt(formulaId));
  const cantNum=parseFloat(cantidad)||0;
  const factor=formula&&cantNum>0?cantNum/formula.cantidadBase:0;

  const ingCalc=formula?formula.ingredientes.map(ing=>{
    const api=apis.find(a=>a.id===ing.apiId);
    const cantNecesaria=parseFloat((ing.cantidad*factor).toFixed(6));
    return{...ing,api,cantNecesaria,suficiente:api?(api.stock>=cantNecesaria):false};
  }):[];

  const puedePreparar=ingCalc.length>0&&ingCalc.every(i=>i.suficiente)&&cantNum>0&&tecnico.trim();
  const costoTotal=ingCalc.reduce((acc,i)=>acc+(i.cantNecesaria*(i.api?.costo||0)),0);

  const confirmar=()=>{
    let apisAct=[...apis];
    const movs=[];
    ingCalc.forEach(ing=>{
      apisAct=apisAct.map(a=>a.id===ing.apiId?{...a,stock:parseFloat((a.stock-ing.cantNecesaria).toFixed(6))}:a);
      movs.push({id:historial.length+movs.length+1,tipo:"uso",apiId:ing.apiId,api:ing.nombre,cantidad:ing.cantNecesaria,unidad:ing.unidad,prep:`${formula.nombre} ${cantNum}${formula.unidadBase}`,tecnico,fecha:new Date().toISOString().split("T")[0],orden:orden||`FM-${Date.now().toString().slice(-4)}`});
    });
    setApis(apisAct);
    setHistorial([...movs,...historial]);
    setPaso(3);
  };

  if(paso===3)return(
    <div style={{maxWidth:500,margin:"0 auto",textAlign:"center",padding:"70px 20px"}}>
      <div style={{fontSize:64,marginBottom:16}}>✅</div>
      <div style={{fontSize:22,fontWeight:700,color:C.green,fontFamily:"sans-serif",marginBottom:8}}>Preparación Registrada</div>
      <div style={{fontSize:14,color:C.muted,fontFamily:"sans-serif",marginBottom:8}}>{formula.nombre} · {cantNum}{formula.unidadBase}</div>
      <div style={{fontSize:13,color:C.muted,fontFamily:"sans-serif",marginBottom:32}}>El inventario se actualizó en tiempo real.</div>
      <Btn onClick={()=>{setPaso(1);setFormulaId("");setCantidad("");setOrden("");setTecnico("");}} size="lg">+ Registrar otra preparación</Btn>
    </div>
  );

  return(
    <div style={{maxWidth:820,margin:"0 auto"}}>
      <div style={{marginBottom:28}}><h2 style={{margin:0,fontSize:24,fontWeight:700,color:C.dark,fontFamily:"sans-serif"}}>⚗️ Preparar Fórmula</h2><p style={{margin:"6px 0 0",fontSize:14,color:C.muted,fontFamily:"sans-serif"}}>Selecciona la fórmula y la cantidad — los ingredientes se descuentan del inventario automáticamente</p></div>

      <div style={{display:"flex",gap:6,marginBottom:28}}>
        {["Configurar","Revisar & Confirmar"].map((s,i)=>(
          <div key={s} style={{flex:1}}>
            <div style={{height:3,background:i+1<=paso?C.primary:C.border,borderRadius:2,marginBottom:6,transition:"background 0.3s"}}/>
            <div style={{fontSize:10,color:i+1===paso?C.primary:i+1<paso?C.green:C.muted,fontFamily:"sans-serif",fontWeight:600}}>{i+1<paso?"✓ ":""}{s}</div>
          </div>
        ))}
      </div>

      {paso===1&&(
        <div>
          <Card style={{marginBottom:20}}>
            <div style={{fontSize:15,fontWeight:700,color:C.dark,marginBottom:16,fontFamily:"sans-serif"}}>📋 Configuración de la Preparación</div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14}}>
              <div style={{gridColumn:"1/-1"}}>
                <SLabel>Fórmula a preparar *</SLabel>
                <select value={formulaId} onChange={e=>{setFormulaId(e.target.value);setCantidad("");}} style={{width:"100%",padding:"11px 14px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:formulaId?C.dark:C.muted,fontSize:14,outline:"none",fontFamily:"sans-serif"}}>
                  <option value="">Seleccionar fórmula...</option>
                  {[...new Set(formulas.map(f=>f.categoria))].map(cat=>(
                    <optgroup key={cat} label={cat}>{formulas.filter(f=>f.categoria===cat).map(f=><option key={f.id} value={f.id}>{f.nombre}</option>)}</optgroup>
                  ))}
                </select>
                {formula&&<div style={{marginTop:8,padding:"10px 14px",background:C.primaryLight,borderRadius:8,fontSize:12,color:C.primary,fontFamily:"sans-serif"}}>📌 Base: {formula.cantidadBase}{formula.unidadBase} · {formula.descripcion}</div>}
              </div>
              <div>
                <SLabel>Cantidad a preparar ({formula?.unidadBase||"unidad"}) *</SLabel>
                <input type="number" value={cantidad} onChange={e=>setCantidad(e.target.value)} placeholder={formula?`Base: ${formula.cantidadBase}`:"0"} style={{width:"100%",padding:"11px 14px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.dark,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"sans-serif"}}/>
                {formula&&cantNum>0&&<div style={{fontSize:11,color:C.primary,fontFamily:"sans-serif",marginTop:6}}>Factor ×{factor.toFixed(3)} vs base {formula.cantidadBase}{formula.unidadBase}</div>}
              </div>
              <div>
                {/* Atajos de cantidad */}
                {formula&&<div>
                  <SLabel>Atajos rápidos</SLabel>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {[0.5,1,2,3,4].map(m=>{const c=formula.cantidadBase*m;return<button key={m} onClick={()=>setCantidad(String(c))} style={{padding:"7px 12px",borderRadius:8,border:`1px solid ${parseFloat(cantidad)===c?C.primary:C.border}`,background:parseFloat(cantidad)===c?C.primaryLight:C.bg,color:parseFloat(cantidad)===c?C.primary:C.dark,fontFamily:"sans-serif",fontSize:12,fontWeight:600,cursor:"pointer"}}>{c}{formula.unidadBase}</button>;})}
                  </div>
                </div>}
              </div>
              <FInput label="Número de orden" value={orden} onChange={setOrden} placeholder="FM-001"/>
              <div style={{gridColumn:"1/-1"}}><FInput label="Técnico que prepara *" value={tecnico} onChange={setTecnico} placeholder="Nombre del técnico / farmacéutico" required/></div>
            </div>
          </Card>

          {formula&&cantNum>0&&(
            <Card style={{border:`1px solid ${puedePreparar?C.greenBorder:C.redBorder}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{fontSize:15,fontWeight:700,color:C.dark,fontFamily:"sans-serif"}}>📊 Ingredientes necesarios — tiempo real</div>
                <div style={{fontSize:14,fontWeight:700,color:C.gold,fontFamily:"sans-serif"}}>Costo: ${costoTotal.toFixed(2)}</div>
              </div>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:C.bg}}>{["Ingrediente",`Para ${cantNum}${formula.unidadBase}`,"Stock disponible","Costo ingr.","Estado"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,letterSpacing:"1px",textTransform:"uppercase",fontFamily:"sans-serif"}}>{h}</th>)}</tr></thead>
                <tbody>{ingCalc.map((ing,i)=>(
                  <tr key={i} style={{borderTop:`1px solid ${C.border}`,background:ing.suficiente?(i%2===0?C.white:C.bg):C.redLight}}>
                    <td style={{padding:"11px 12px",fontSize:13,fontWeight:600,color:C.dark,fontFamily:"sans-serif"}}>{ing.nombre}</td>
                    <td style={{padding:"11px 12px",fontSize:15,fontWeight:700,color:C.primary,fontFamily:"sans-serif"}}>{ing.cantNecesaria.toFixed(4)} {ing.unidad}</td>
                    <td style={{padding:"11px 12px"}}>
                      <div style={{fontSize:13,fontWeight:600,color:ing.suficiente?C.green:C.red,fontFamily:"sans-serif"}}>{ing.api?`${ing.api.stock} ${ing.api.unidad}`:"—"}</div>
                      {ing.api&&<div style={{height:4,background:C.border,borderRadius:2,marginTop:4,width:80}}><div style={{height:"100%",width:`${Math.min(100,(ing.api.stock/Math.max(ing.cantNecesaria,0.0001))*100)}%`,background:ing.suficiente?C.green:C.red,borderRadius:2}}/></div>}
                    </td>
                    <td style={{padding:"11px 12px",fontSize:12,fontWeight:600,color:C.gold,fontFamily:"sans-serif"}}>${(ing.cantNecesaria*(ing.api?.costo||0)).toFixed(2)}</td>
                    <td style={{padding:"11px 12px"}}>{ing.suficiente?<Badge color={C.green} bg={C.greenLight}>✓ OK</Badge>:<Badge color={C.red} bg={C.redLight}>✕ Insuficiente</Badge>}</td>
                  </tr>
                ))}</tbody>
              </table>
              {ingCalc.some(i=>!i.suficiente)&&<div style={{marginTop:14,padding:"12px 16px",background:C.redLight,borderRadius:10,fontSize:13,color:C.red,fontFamily:"sans-serif",fontWeight:600}}>⚠️ Stock insuficiente en algunos ingredientes. Ve a Inventario → Recibir API para agregar stock antes de preparar.</div>}
            </Card>
          )}

          <div style={{display:"flex",justifyContent:"flex-end",marginTop:24}}>
            <Btn onClick={()=>setPaso(2)} disabled={!puedePreparar} color={C.primary} size="lg">Revisar Preparación →</Btn>
          </div>
        </div>
      )}

      {paso===2&&formula&&(
        <div>
          <Card style={{marginBottom:16,border:`2px solid ${C.primaryBorder}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div><div style={{fontSize:18,fontWeight:700,color:C.dark,fontFamily:"sans-serif"}}>{formula.nombre}</div><div style={{fontSize:13,color:C.muted,fontFamily:"sans-serif"}}>{cantNum}{formula.unidadBase} · Técnico: {tecnico} · {orden||"Sin # orden"}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:22,fontWeight:700,color:C.gold,fontFamily:"sans-serif"}}>${costoTotal.toFixed(2)}</div><div style={{fontSize:11,color:C.muted,fontFamily:"sans-serif"}}>costo en APIs</div></div>
            </div>
            <div style={{padding:"14px 16px",background:C.redLight,borderRadius:10,border:`1px solid ${C.redBorder}`,marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:700,color:C.red,fontFamily:"sans-serif",marginBottom:10}}>⚠️ Al confirmar se descuenta del inventario inmediatamente:</div>
              {ingCalc.map((ing,i)=>(
                <div key={i} style={{fontSize:13,color:C.dark,fontFamily:"sans-serif",padding:"5px 0",borderBottom:i<ingCalc.length-1?`1px solid ${C.redBorder}`:"none"}}>
                  <span style={{fontWeight:600}}>{ing.nombre}:</span> −{ing.cantNecesaria.toFixed(4)} {ing.unidad}
                  <span style={{color:C.muted}}> → quedarán {(ing.api.stock-ing.cantNecesaria).toFixed(4)} {ing.unidad}</span>
                </div>
              ))}
            </div>
            <div style={{fontSize:13,color:C.muted,fontFamily:"sans-serif"}}>Esta acción queda registrada en el historial y el gerente puede verla en tiempo real. No se puede deshacer.</div>
          </Card>
          <div style={{display:"flex",gap:12,justifyContent:"space-between"}}>
            <Btn onClick={()=>setPaso(1)} variant="outline" color={C.muted} size="lg">← Editar</Btn>
            <Btn onClick={confirmar} color={C.green} size="lg">✅ Confirmar — Descontar Inventario</Btn>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════ CALCULADORA ═══════════
const Calculadora=({formulas,apis})=>{
  const [formulaId,setFormulaId]=useState("");
  const [cantidad,setCantidad]=useState("");
  const [modo,setModo]=useState("formula");
  const [ingManual,setIngManual]=useState([{apiId:"",pct:""}]);
  const [cantTotal,setCantTotal]=useState("");

  const formula=formulas.find(f=>f.id===parseInt(formulaId));
  const cantNum=parseFloat(cantidad)||0;
  const factor=formula&&cantNum>0?cantNum/formula.cantidadBase:0;

  const ingCalc=formula&&cantNum>0?formula.ingredientes.map(ing=>{
    const api=apis.find(a=>a.id===ing.apiId);
    return{...ing,api,cantNecesaria:parseFloat((ing.cantidad*factor).toFixed(6))};
  }):[];
  const costoTotal=ingCalc.reduce((acc,i)=>acc+(i.cantNecesaria*(i.api?.costo||0)),0);
  const cantTotalNum=parseFloat(cantTotal)||0;

  return(
    <div style={{maxWidth:820,margin:"0 auto"}}>
      <div style={{marginBottom:28}}><h2 style={{margin:0,fontSize:24,fontWeight:700,color:C.dark,fontFamily:"sans-serif"}}>🧮 Calculadora de Fórmulas</h2><p style={{margin:"6px 0 0",fontSize:14,color:C.muted,fontFamily:"sans-serif"}}>Calcula cantidades para cualquier volumen — sin descontar inventario</p></div>
      <div style={{display:"flex",gap:10,marginBottom:24}}>
        {[["formula","📋 Por Fórmula Maestra"],["manual","✏️ Manual por Porcentaje"]].map(([val,label])=>(
          <button key={val} onClick={()=>setModo(val)} style={{padding:"11px 22px",borderRadius:10,border:`2px solid ${modo===val?C.primary:C.border}`,background:modo===val?C.primaryLight:"transparent",color:modo===val?C.primary:C.muted,fontFamily:"sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>{label}</button>
        ))}
      </div>

      {modo==="formula"&&(
        <div>
          <Card style={{marginBottom:20}}>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16,alignItems:"end"}}>
              <div>
                <SLabel>Fórmula</SLabel>
                <select value={formulaId} onChange={e=>{setFormulaId(e.target.value);setCantidad("");}} style={{width:"100%",padding:"11px 14px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:formulaId?C.dark:C.muted,fontSize:14,outline:"none",fontFamily:"sans-serif"}}>
                  <option value="">Seleccionar fórmula...</option>
                  {[...new Set(formulas.map(f=>f.categoria))].map(cat=>(
                    <optgroup key={cat} label={cat}>{formulas.filter(f=>f.categoria===cat).map(f=><option key={f.id} value={f.id}>{f.nombre}</option>)}</optgroup>
                  ))}
                </select>
              </div>
              <div>
                <SLabel>Cantidad ({formula?.unidadBase||"unidad"})</SLabel>
                <input type="number" value={cantidad} onChange={e=>setCantidad(e.target.value)} placeholder={formula?`Base: ${formula.cantidadBase}`:"0"} style={{width:"100%",padding:"11px 14px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.dark,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"sans-serif"}}/>
              </div>
            </div>
            {formula&&(
              <div style={{marginTop:16}}>
                <SLabel>Atajos rápidos</SLabel>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {[0.5,1,1.5,2,3,4,6].map(m=>{const c=formula.cantidadBase*m;return<button key={m} onClick={()=>setCantidad(String(c))} style={{padding:"8px 14px",borderRadius:8,border:`1px solid ${parseFloat(cantidad)===c?C.primary:C.border}`,background:parseFloat(cantidad)===c?C.primaryLight:C.bg,color:parseFloat(cantidad)===c?C.primary:C.dark,fontFamily:"sans-serif",fontSize:12,fontWeight:600,cursor:"pointer"}}>{c}{formula.unidadBase}</button>;})}
                </div>
              </div>
            )}
          </Card>
          {ingCalc.length>0&&(
            <Card>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{fontSize:15,fontWeight:700,color:C.dark,fontFamily:"sans-serif"}}>Ingredientes para {cantNum} {formula.unidadBase} — Factor ×{factor.toFixed(3)}</div>
                <div style={{fontSize:14,fontWeight:700,color:C.gold,fontFamily:"sans-serif"}}>Costo: ${costoTotal.toFixed(2)}</div>
              </div>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:C.bg}}>{["Ingrediente",`Para ${cantNum}${formula.unidadBase}`,`Base ${formula.cantidadBase}${formula.unidadBase}`,"%","Stock","Costo"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,letterSpacing:"1px",textTransform:"uppercase",fontFamily:"sans-serif"}}>{h}</th>)}</tr></thead>
                <tbody>{ingCalc.map((ing,i)=>{
                  const pct=((ing.cantidad/formula.cantidadBase)*100).toFixed(3);
                  return(
                    <tr key={i} style={{borderTop:`1px solid ${C.border}`,background:i%2===0?C.white:C.bg}}>
                      <td style={{padding:"11px 12px",fontSize:13,fontWeight:600,color:C.dark,fontFamily:"sans-serif"}}>{ing.nombre}</td>
                      <td style={{padding:"11px 12px",fontSize:15,fontWeight:700,color:C.primary,fontFamily:"sans-serif"}}>{ing.cantNecesaria.toFixed(4)} {ing.unidad}</td>
                      <td style={{padding:"11px 12px",fontSize:12,color:C.muted,fontFamily:"sans-serif"}}>{ing.cantidad} {ing.unidad}</td>
                      <td style={{padding:"11px 12px",fontSize:12,color:C.darkMid,fontFamily:"sans-serif"}}>{pct}%</td>
                      <td style={{padding:"11px 12px",fontSize:12,fontWeight:600,color:(ing.api?.stock||0)>=ing.cantNecesaria?C.green:C.red,fontFamily:"sans-serif"}}>{ing.api?`${ing.api.stock}${ing.api.unidad}`:"—"}</td>
                      <td style={{padding:"11px 12px",fontSize:12,fontWeight:600,color:C.gold,fontFamily:"sans-serif"}}>${(ing.cantNecesaria*(ing.api?.costo||0)).toFixed(2)}</td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </Card>
          )}
        </div>
      )}

      {modo==="manual"&&(
        <div>
          <Card style={{marginBottom:16}}>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,alignItems:"end"}}>
              <FInput label="Cantidad total a preparar (g, ml, u...)" value={cantTotal} onChange={setCantTotal} placeholder="30" type="number"/>
              <div style={{padding:"10px 14px",background:C.primaryLight,borderRadius:8,marginBottom:14,textAlign:"center"}}>
                <div style={{fontSize:11,color:C.muted,fontFamily:"sans-serif"}}>Total</div>
                <div style={{fontSize:22,fontWeight:700,color:C.primary,fontFamily:"sans-serif"}}>{cantTotalNum}</div>
              </div>
            </div>
            <SLabel>Ingredientes y sus porcentajes</SLabel>
            <div style={{marginBottom:10,display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:8}}>
              {["Ingrediente / API","% en fórmula","Cantidad resultante",""].map(h=><div key={h} style={{fontSize:10,fontWeight:700,color:C.muted,letterSpacing:"1px",textTransform:"uppercase",fontFamily:"sans-serif",paddingBottom:6}}>{h}</div>)}
            </div>
            {ingManual.map((ing,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:8,marginBottom:8,alignItems:"center"}}>
                <select value={ing.apiId} onChange={e=>{const n=[...ingManual];n[i].apiId=e.target.value;setIngManual(n);}} style={{padding:"10px 12px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.dark,fontSize:13,outline:"none",fontFamily:"sans-serif"}}>
                  <option value="">Seleccionar API...</option>
                  {apis.map(a=><option key={a.id} value={a.id}>{a.nombre}</option>)}
                </select>
                <input type="number" value={ing.pct} onChange={e=>{const n=[...ingManual];n[i].pct=e.target.value;setIngManual(n);}} placeholder="%" min="0" max="100" style={{padding:"10px 12px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.dark,fontSize:14,outline:"none",fontFamily:"sans-serif"}}/>
                <div style={{padding:"10px 12px",background:C.primaryLight,borderRadius:8,textAlign:"center",fontSize:14,fontWeight:700,color:C.primary,fontFamily:"sans-serif"}}>
                  {cantTotalNum>0&&ing.pct?`${((parseFloat(ing.pct)/100)*cantTotalNum).toFixed(4)}g`:"—"}
                </div>
                {ingManual.length>1&&<button onClick={()=>setIngManual(ingManual.filter((_,x)=>x!==i))} style={{padding:"10px 12px",background:C.redLight,border:`1px solid ${C.redBorder}`,borderRadius:8,color:C.red,cursor:"pointer",fontSize:13,fontFamily:"sans-serif"}}>✕</button>}
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12}}>
              <Btn onClick={()=>setIngManual([...ingManual,{apiId:"",pct:""}])} variant="outline" color={C.primary} size="sm">+ Agregar ingrediente</Btn>
              <div style={{fontSize:13,fontFamily:"sans-serif"}}>
                Suma: <span style={{fontWeight:700,color:ingManual.reduce((a,i)=>a+(parseFloat(i.pct)||0),0)>100?C.red:C.green}}>
                  {ingManual.reduce((a,i)=>a+(parseFloat(i.pct)||0),0).toFixed(1)}%
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// ═══════════ HISTORIAL ═══════════
const Historial=({historial})=>{
  const [busqueda,setBusqueda]=useState("");
  const [tipoFiltro,setTipoFiltro]=useState("todos");
  const filtrado=historial.filter(h=>{
    const q=busqueda.toLowerCase();
    const mQ=!q||h.api.toLowerCase().includes(q)||h.prep.toLowerCase().includes(q)||h.tecnico.toLowerCase().includes(q)||h.orden.toLowerCase().includes(q);
    const mT=tipoFiltro==="todos"||h.tipo===tipoFiltro;
    return mQ&&mT;
  });
  const porFecha=filtrado.reduce((acc,h)=>{if(!acc[h.fecha])acc[h.fecha]=[];acc[h.fecha].push(h);return acc;},{});
  return(
    <div>
      <div style={{marginBottom:24}}><h2 style={{margin:0,fontSize:24,fontWeight:700,color:C.dark,fontFamily:"sans-serif"}}>📋 Historial de Movimientos</h2><p style={{margin:"6px 0 0",fontSize:14,color:C.muted,fontFamily:"sans-serif"}}>Registro completo de entradas, usos de fórmulas y ajustes</p></div>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <input value={busqueda} onChange={e=>setBusqueda(e.target.value)} placeholder="🔍 Buscar por API, preparación, técnico..." style={{flex:1,minWidth:200,padding:"10px 14px",background:C.white,border:`1px solid ${C.border}`,borderRadius:8,color:C.dark,fontSize:14,outline:"none",fontFamily:"sans-serif"}} onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.border}/>
        {[["todos","Todos"],["uso","⬆️ Usos"],["entrada","📦 Entradas"]].map(([val,label])=>(
          <button key={val} onClick={()=>setTipoFiltro(val)} style={{padding:"10px 18px",borderRadius:8,border:`1px solid ${tipoFiltro===val?C.primary:C.border}`,background:tipoFiltro===val?C.primary:C.bg,color:tipoFiltro===val?"#fff":C.muted,fontFamily:"sans-serif",fontSize:12,fontWeight:600,cursor:"pointer"}}>{label}</button>
        ))}
      </div>
      {Object.entries(porFecha).map(([fecha,movs])=>(
        <div key={fecha} style={{marginBottom:20}}>
          <div style={{fontSize:11,fontWeight:700,color:C.muted,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:10,fontFamily:"sans-serif",display:"flex",alignItems:"center",gap:10}}>📅 {fecha}<div style={{flex:1,height:1,background:C.border}}/></div>
          <Card style={{padding:0,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:C.bg}}>{["Tipo","API","Cantidad","Preparación","Técnico","Orden"].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,letterSpacing:"1px",textTransform:"uppercase",fontFamily:"sans-serif"}}>{h}</th>)}</tr></thead>
              <tbody>{movs.map((h,i)=>(
                <tr key={h.id} style={{borderTop:`1px solid ${C.border}`,background:i%2===0?C.white:C.bg}}>
                  <td style={{padding:"11px 14px"}}>{h.tipo==="entrada"?<Badge color={C.green} bg={C.greenLight}>📦 Entrada</Badge>:<Badge color={C.red} bg={C.redLight}>⬆️ Uso</Badge>}</td>
                  <td style={{padding:"11px 14px",fontSize:13,fontWeight:600,color:C.dark,fontFamily:"sans-serif"}}>{h.api}</td>
                  <td style={{padding:"11px 14px",fontSize:14,fontWeight:700,color:h.tipo==="entrada"?C.green:C.red,fontFamily:"sans-serif"}}>{h.tipo==="entrada"?"+":"−"}{h.cantidad} {h.unidad}</td>
                  <td style={{padding:"11px 14px",fontSize:12,color:C.darkMid,fontFamily:"sans-serif"}}>{h.prep!=="—"?h.prep:"—"}</td>
                  <td style={{padding:"11px 14px"}}><Badge color={C.primary}>{h.tecnico}</Badge></td>
                  <td style={{padding:"11px 14px",fontSize:12,color:C.muted,fontFamily:"sans-serif"}}>{h.orden}</td>
                </tr>
              ))}</tbody>
            </table>
          </Card>
        </div>
      ))}
    </div>
  );
};

// ═══════════ GESTIÓN DE FÓRMULAS ═══════════
const formulaVacia=()=>({id:0,nombre:"",categoria:"",descripcion:"",cantidadBase:30,unidadBase:"g",ingredientes:[{apiId:"",nombre:"",cantidad:"",unidad:"g"}]});

const GestionFormulas=({formulas,setFormulas,apis})=>{
  const [modal,setModal]=useState(null); // null | "editar" | "nuevo"
  const [form,setForm]=useState(formulaVacia());
  const [confirmarEliminar,setConfirmarEliminar]=useState(null);

  const abrirNueva=()=>{setForm({...formulaVacia(),id:Math.max(...formulas.map(f=>f.id),0)+1});setModal("nuevo");};
  const abrirEditar=(f)=>{setForm(JSON.parse(JSON.stringify(f)));setModal("editar");};

  const updIng=(i,campo,val)=>{
    const ings=[...form.ingredientes];
    ings[i]={...ings[i],[campo]:val};
    if(campo==="apiId"){const api=apis.find(a=>a.id===parseInt(val));ings[i].nombre=api?.nombre||"";ings[i].unidad=api?.unidad||"g";}
    setForm({...form,ingredientes:ings});
  };
  const addIng=()=>setForm({...form,ingredientes:[...form.ingredientes,{apiId:"",nombre:"",cantidad:"",unidad:"g"}]});
  const remIng=(i)=>form.ingredientes.length>1&&setForm({...form,ingredientes:form.ingredientes.filter((_,x)=>x!==i)});

  const guardar=()=>{
    const limpio={...form,cantidadBase:parseFloat(form.cantidadBase)||30,
      ingredientes:form.ingredientes.filter(i=>i.apiId&&i.cantidad).map(i=>({apiId:parseInt(i.apiId),nombre:i.nombre,cantidad:parseFloat(i.cantidad),unidad:i.unidad}))};
    if(!limpio.nombre||limpio.ingredientes.length===0)return;
    if(modal==="nuevo"){setFormulas([...formulas,limpio]);}
    else{setFormulas(formulas.map(f=>f.id===limpio.id?limpio:f));}
    setModal(null);
  };

  const eliminar=(id)=>{setFormulas(formulas.filter(f=>f.id!==id));setConfirmarEliminar(null);};

  const cats=[...new Set(formulas.map(f=>f.categoria))];

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div><h2 style={{margin:0,fontSize:24,fontWeight:700,color:C.dark,fontFamily:"sans-serif"}}>📝 Gestión de Fórmulas</h2><p style={{margin:"6px 0 0",fontSize:14,color:C.muted,fontFamily:"sans-serif"}}>{formulas.length} fórmulas magistrales · Edita, crea o elimina</p></div>
        <Btn onClick={abrirNueva} color={C.primary} size="lg">+ Nueva Fórmula</Btn>
      </div>

      {[...new Set(formulas.map(f=>f.categoria))].map(cat=>(
        <div key={cat} style={{marginBottom:28}}>
          <div style={{fontSize:12,fontWeight:700,color:C.muted,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12,fontFamily:"sans-serif",display:"flex",alignItems:"center",gap:10}}>
            {cat}<div style={{flex:1,height:1,background:C.border}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:14}}>
            {formulas.filter(f=>f.categoria===cat).map(f=>(
              <Card key={f.id} style={{padding:18,position:"relative"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div style={{flex:1,marginRight:8}}>
                    <div style={{fontSize:14,fontWeight:700,color:C.dark,fontFamily:"sans-serif",marginBottom:4}}>{f.nombre}</div>
                    <div style={{fontSize:12,color:C.muted,fontFamily:"sans-serif"}}>{f.descripcion}</div>
                  </div>
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    <Btn onClick={()=>abrirEditar(f)} size="sm" color={C.primary} variant="outline">✏️ Editar</Btn>
                    <Btn onClick={()=>setConfirmarEliminar(f)} size="sm" color={C.red} variant="outline">🗑️</Btn>
                  </div>
                </div>
                <div style={{padding:"8px 12px",background:C.primaryLight,borderRadius:8,marginBottom:10,fontSize:12,color:C.primary,fontFamily:"sans-serif"}}>
                  Base: <strong>{f.cantidadBase} {f.unidadBase}</strong>
                </div>
                <div>
                  {f.ingredientes.map((ing,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:i<f.ingredientes.length-1?`1px solid ${C.border}`:"none",fontSize:12,fontFamily:"sans-serif"}}>
                      <span style={{color:C.darkMid,fontWeight:500}}>{ing.nombre}</span>
                      <span style={{color:C.primary,fontWeight:700}}>{ing.cantidad} {ing.unidad}</span>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:10,fontSize:11,color:C.muted,fontFamily:"sans-serif",textAlign:"right"}}>
                  Costo est: <span style={{color:C.gold,fontWeight:700}}>${f.ingredientes.reduce((acc,ing)=>{const api=apis.find(a=>a.id===ing.apiId);return acc+(ing.cantidad*(api?.costo||0));},0).toFixed(2)}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* MODAL EDITAR / NUEVO */}
      {modal&&(
        <Modal onClose={()=>setModal(null)} wide>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div style={{fontSize:18,fontWeight:700,color:C.dark,fontFamily:"sans-serif"}}>{modal==="nuevo"?"➕ Nueva Fórmula":"✏️ Editar Fórmula"}</div>
            <button onClick={()=>setModal(null)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.muted}}>✕</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            <div style={{gridColumn:"1/-1"}}><FInput label="Nombre de la fórmula *" value={form.nombre} onChange={v=>setForm({...form,nombre:v})} placeholder="Ej: Crema Tretinoína 0.025%" required/></div>
            <div>
              <SLabel>Categoría</SLabel>
              <input list="cats-list" value={form.categoria} onChange={e=>setForm({...form,categoria:e.target.value})} placeholder="Dermatológico, Hormonal..."
                style={{width:"100%",padding:"10px 12px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.dark,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"sans-serif",marginBottom:14}}
                onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.border}/>
              <datalist id="cats-list">{cats.map(c=><option key={c} value={c}/>)}</datalist>
            </div>
            <FInput label="Descripción" value={form.descripcion} onChange={v=>setForm({...form,descripcion:v})} placeholder="Breve descripción del uso"/>
            <div>
              <SLabel>Cantidad base *</SLabel>
              <input type="number" value={form.cantidadBase} onChange={e=>setForm({...form,cantidadBase:e.target.value})} placeholder="30"
                style={{width:"100%",padding:"10px 12px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.dark,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"sans-serif",marginBottom:14}}/>
            </div>
            <div>
              <SLabel>Unidad base</SLabel>
              <select value={form.unidadBase} onChange={e=>setForm({...form,unidadBase:e.target.value})} style={{width:"100%",padding:"11px 14px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.dark,fontSize:14,outline:"none",fontFamily:"sans-serif",marginBottom:14}}>
                {["g","ml","cáps","oz","u"].map(u=><option key={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:16,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <SLabel>Ingredientes *</SLabel>
              <Btn onClick={addIng} size="sm" variant="outline" color={C.primary}>+ Ingrediente</Btn>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:8,marginBottom:8}}>
              {["API / Ingrediente","Cantidad","Unidad",""].map(h=><div key={h} style={{fontSize:10,fontWeight:700,color:C.muted,letterSpacing:"1px",textTransform:"uppercase",fontFamily:"sans-serif"}}>{h}</div>)}
            </div>
            {form.ingredientes.map((ing,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:8,marginBottom:8,alignItems:"center"}}>
                <select value={ing.apiId} onChange={e=>updIng(i,"apiId",e.target.value)} style={{padding:"10px 12px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:ing.apiId?C.dark:C.muted,fontSize:13,outline:"none",fontFamily:"sans-serif"}}>
                  <option value="">Seleccionar API...</option>
                  {apis.map(a=><option key={a.id} value={a.id}>{a.nombre}</option>)}
                </select>
                <input type="number" value={ing.cantidad} onChange={e=>updIng(i,"cantidad",e.target.value)} placeholder="0.00" style={{padding:"10px 12px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.dark,fontSize:14,outline:"none",fontFamily:"sans-serif"}}/>
                <select value={ing.unidad} onChange={e=>updIng(i,"unidad",e.target.value)} style={{padding:"10px 12px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.dark,fontSize:13,outline:"none",fontFamily:"sans-serif"}}>
                  {["g","mg","ml","u"].map(u=><option key={u}>{u}</option>)}
                </select>
                {form.ingredientes.length>1&&<button onClick={()=>remIng(i)} style={{padding:"10px 12px",background:C.redLight,border:`1px solid ${C.redBorder}`,borderRadius:8,color:C.red,cursor:"pointer",fontSize:13,fontFamily:"sans-serif"}}>✕</button>}
              </div>
            ))}
          </div>

          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
            <Btn onClick={()=>setModal(null)} variant="outline" color={C.muted}>Cancelar</Btn>
            <Btn onClick={guardar} disabled={!form.nombre||!form.categoria||form.ingredientes.every(i=>!i.apiId)} color={C.primary} size="lg">
              {modal==="nuevo"?"✅ Crear Fórmula":"✅ Guardar Cambios"}
            </Btn>
          </div>
        </Modal>
      )}

      {/* MODAL CONFIRMAR ELIMINAR */}
      {confirmarEliminar&&(
        <Modal onClose={()=>setConfirmarEliminar(null)}>
          <div style={{textAlign:"center",padding:"8px 0 16px"}}>
            <div style={{fontSize:48,marginBottom:12}}>🗑️</div>
            <div style={{fontSize:17,fontWeight:700,color:C.dark,fontFamily:"sans-serif",marginBottom:8}}>¿Eliminar esta fórmula?</div>
            <div style={{fontSize:14,color:C.muted,fontFamily:"sans-serif",marginBottom:24}}><strong>{confirmarEliminar.nombre}</strong><br/>Esta acción no se puede deshacer.</div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <Btn onClick={()=>setConfirmarEliminar(null)} variant="outline" color={C.muted}>Cancelar</Btn>
              <Btn onClick={()=>eliminar(confirmarEliminar.id)} color={C.red}>Sí, eliminar</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ═══════════ MAIN ═══════════
export default function App(){
  const [tab,setTab]=useState("dashboard");
  const [apis,setApis]=useState(APIS_INIT);
  const [historial,setHistorial]=useState(HISTORIAL_INIT);
  const [formulas,setFormulas]=useState(FORMULAS_INIT);
  const criticos=apis.filter(a=>a.stock<a.min).length;
  const NAV=[{id:"dashboard",icon:"📊",label:"Dashboard"},{id:"inventario",icon:"🧪",label:"Inventario"},{id:"preparar",icon:"⚗️",label:"Preparar Fórmula"},{id:"calcular",icon:"🧮",label:"Calculadora"},{id:"formulas",icon:"📝",label:"Gestión Fórmulas"},{id:"historial",icon:"📋",label:"Historial"}];
  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"sans-serif"}}>
      <div style={{background:C.dark,borderBottom:`3px solid ${C.primary}`}}>
        <div style={{maxWidth:1280,margin:"0 auto",padding:"0 28px",display:"flex",alignItems:"center",gap:4}}>
          <div style={{padding:"18px 0",display:"flex",alignItems:"center",gap:12,marginRight:20}}>
            <div style={{width:38,height:38,borderRadius:8,background:C.primary,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:16,fontWeight:900,color:"#fff",fontFamily:"Georgia,serif"}}>Rx</span>
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:"#fff",letterSpacing:"0.5px"}}>Farmacia Mía+</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",letterSpacing:"2px",textTransform:"uppercase"}}>Control de Inventario · APIs</div>
            </div>
          </div>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)} style={{padding:"19px 16px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"sans-serif",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:6,color:tab===n.id?C.primary:"rgba(255,255,255,0.5)",borderBottom:tab===n.id?`3px solid ${C.primary}`:"3px solid transparent",marginBottom:-3,transition:"all 0.15s"}}>
              {n.icon} {n.label}
              {n.id==="dashboard"&&criticos>0&&<span style={{width:18,height:18,borderRadius:"50%",background:C.red,color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{criticos}</span>}
            </button>
          ))}
          <div style={{marginLeft:"auto",fontSize:10,color:"rgba(255,255,255,0.25)",letterSpacing:"1px"}}>GA RX Consulting</div>
        </div>
      </div>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"36px 28px"}}>
        {tab==="dashboard"&&<Dashboard apis={apis} historial={historial}/>}
        {tab==="inventario"&&<Inventario apis={apis} setApis={setApis} historial={historial} setHistorial={setHistorial}/>}
        {tab==="preparar"&&<PrepararFormula apis={apis} setApis={setApis} historial={historial} setHistorial={setHistorial} formulas={formulas}/>}
        {tab==="calcular"&&<Calculadora formulas={formulas} apis={apis}/>}
        {tab==="formulas"&&<GestionFormulas formulas={formulas} setFormulas={setFormulas} apis={apis}/>}
        {tab==="historial"&&<Historial historial={historial}/>}
      </div>
    </div>
  );
}
