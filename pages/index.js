import { useState, useEffect } from 'react'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getLS(key, fallback) {
  if(typeof window === 'undefined') return fallback
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}
function setLS(key, value) {
  if(typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(value))
}
function uid() { return Math.random().toString(36).slice(2)+Date.now().toString(36) }
function money(n) { return Number(n).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}) }
function today() { return new Date().toISOString().slice(0,10) }
function fmtDate(d) {
  if(!d) return ''
  const [y,m,day] = d.split('-')
  const months = ['jan.','fev.','mar.','abr.','mai.','jun.','jul.','ago.','set.','out.','nov.','dez.']
  return parseInt(day)+' de '+months[parseInt(m)-1]+' de '+y
}
function fmtDateShort(d) {
  if(!d) return ''
  const [y,m,day] = d.split('-')
  return day+'/'+m+'/'+y
}

const R = money
const todayStr = today

const defaultProducts = [
  {id:'s1',nome:'1/2 hora quadra de areia (após 17h)',categoria:'Serviço',responsavel:'Renata',preco:30,ativo:true},
  {id:'s2',nome:'1/2 hora quadra de areia (até 17h)',categoria:'Serviço',responsavel:'Renata',preco:28,ativo:true},
  {id:'s3',nome:'1/2 quadra society (após 17h)',categoria:'Serviço',responsavel:'Renata',preco:65,ativo:true},
  {id:'s4',nome:'1/2 quadra society (até 17h)',categoria:'Serviço',responsavel:'Renata',preco:50,ativo:true},
  {id:'s5',nome:'Banho de sauna',categoria:'Serviço',responsavel:'Renata',preco:15,ativo:true},
  {id:'s6',nome:'Fichas (Sinuca/Totó)',categoria:'Serviço',responsavel:'Renata',preco:1,ativo:true},
  {id:'b1',nome:'Brahma 600ml',categoria:'Bar',responsavel:'Renata',preco:11,ativo:true},
  {id:'b2',nome:'Cerveja Antartica 1L',categoria:'Bar',responsavel:'Renata',preco:13,ativo:true},
  {id:'b3',nome:'Cerveja Brahma 1L',categoria:'Bar',responsavel:'Renata',preco:13,ativo:true},
  {id:'b4',nome:'Cerveja Budweiser Long Neck',categoria:'Bar',responsavel:'Renata',preco:10,ativo:true},
  {id:'b5',nome:'Cigarro varejo',categoria:'Bar',responsavel:'Shay',preco:2,ativo:true},
  {id:'b6',nome:'Coca-cola 2L',categoria:'Bar',responsavel:'Renata',preco:13,ativo:true},
  {id:'b7',nome:'Coca-cola lata',categoria:'Bar',responsavel:'Renata',preco:6,ativo:true},
  {id:'b8',nome:'Coca-cola lata zero',categoria:'Bar',responsavel:'Renata',preco:6,ativo:true},
  {id:'b9',nome:'Coca-cola zero 2L',categoria:'Bar',responsavel:'Renata',preco:13,ativo:true},
  {id:'b10',nome:'Corona Long Neck',categoria:'Bar',responsavel:'Renata',preco:13,ativo:true},
  {id:'b11',nome:'Dose',categoria:'Bar',responsavel:'Renata',preco:5,ativo:true},
  {id:'b12',nome:'Energético Monster',categoria:'Bar',responsavel:'Renata',preco:15,ativo:true},
  {id:'b13',nome:'Gatorade',categoria:'Bar',responsavel:'Renata',preco:9,ativo:true},
  {id:'b14',nome:'Guaraná lata',categoria:'Bar',responsavel:'Renata',preco:6,ativo:true},
  {id:'b15',nome:'Guaraná lata zero',categoria:'Bar',responsavel:'Renata',preco:6,ativo:true},
  {id:'b16',nome:'Guaravita',categoria:'Bar',responsavel:'Renata',preco:3,ativo:true},
  {id:'b17',nome:'Guaraviton',categoria:'Bar',responsavel:'Renata',preco:6,ativo:true},
  {id:'b18',nome:'H20 500ml',categoria:'Bar',responsavel:'Renata',preco:8,ativo:true},
  {id:'b19',nome:'Halls',categoria:'Bar',responsavel:'Renata',preco:3,ativo:true},
  {id:'b20',nome:'Sabonete',categoria:'Bar',responsavel:'Renata',preco:3,ativo:true},
  {id:'b21',nome:'Smirnoff ice',categoria:'Bar',responsavel:'Renata',preco:13,ativo:true},
  {id:'b22',nome:'Suco 1L',categoria:'Bar',responsavel:'Renata',preco:8,ativo:true},
  {id:'b23',nome:'Vodka - Dose',categoria:'Bar',responsavel:'Renata',preco:5,ativo:true},
  {id:'b24',nome:'skol beats',categoria:'Bar',responsavel:'Renata',preco:12,ativo:true},
  {id:'b25',nome:'Água com gás',categoria:'Bar',responsavel:'Renata',preco:4,ativo:true},
  {id:'b26',nome:'Água sem gás',categoria:'Bar',responsavel:'Renata',preco:3,ativo:true},
  {id:'c1',nome:'Batata',categoria:'Comida',responsavel:'Shay',preco:10,ativo:true},
  {id:'c2',nome:'Mini salgado',categoria:'Comida',responsavel:'Shay',preco:12,ativo:true},
  {id:'c3',nome:'Paçoca',categoria:'Comida',responsavel:'Renata',preco:1.5,ativo:true},
  {id:'c4',nome:'Porção de calabresa',categoria:'Comida',responsavel:'Shay',preco:22,ativo:true},
  {id:'c5',nome:'Salgado de forno',categoria:'Comida',responsavel:'Shay',preco:8,ativo:true},
];


const preloadStone = {"2026-04-01": 302.0, "2026-04-02": 416.0, "2026-04-03": 1446.8, "2026-04-04": 386.0, "2026-04-05": 310.0, "2026-04-06": 349.0, "2026-04-07": 199.0, "2026-04-08": 388.0, "2026-04-09": 74.0, "2026-04-10": 364.0, "2026-04-11": 285.0, "2026-04-12": 386.3, "2026-04-13": 145.99, "2026-04-14": 13.0, "2026-04-15": 572.0, "2026-04-16": 152.0, "2026-04-17": 342.0, "2026-04-18": 382.0, "2026-04-19": 464.0, "2026-04-20": 131.0, "2026-04-21": 344.0, "2026-04-22": 148.0, "2026-04-23": 475.0, "2026-04-25": 252.0};

const preloadSales = [{"id": "p0001", "date": "2026-04-01", "produto": "Cerveja Antartica 1L", "responsavel": "Renata", "qtd": 10, "unit": 13.0, "total": 130.0, "productId": ""}, {"id": "p0002", "date": "2026-04-01", "produto": "Água sem gás", "responsavel": "Renata", "qtd": 3, "unit": 3.0, "total": 9.0, "productId": ""}, {"id": "p0003", "date": "2026-04-01", "produto": "Salgado de forno", "responsavel": "Shay", "qtd": 4, "unit": 8.0, "total": 32.0, "productId": ""}, {"id": "p0004", "date": "2026-04-01", "produto": "Batata", "responsavel": "Shay", "qtd": 2, "unit": 10.0, "total": 20.0, "productId": ""}, {"id": "p0005", "date": "2026-04-01", "produto": "Água com gás", "responsavel": "Renata", "qtd": 1, "unit": 4.0, "total": 4.0, "productId": ""}, {"id": "p0006", "date": "2026-04-01", "produto": "Coca-cola lata", "responsavel": "Renata", "qtd": 5, "unit": 6.0, "total": 30.0, "productId": ""}, {"id": "p0007", "date": "2026-04-01", "produto": "Paçoca", "responsavel": "Renata", "qtd": 2, "unit": 1.5, "total": 3.0, "productId": ""}, {"id": "p0008", "date": "2026-04-01", "produto": "Guaravita", "responsavel": "Renata", "qtd": 1, "unit": 3.0, "total": 3.0, "productId": ""}, {"id": "p0009", "date": "2026-04-01", "produto": "1/2 hora quadra de areia (após 17h)", "responsavel": "Renata", "qtd": 2, "unit": 30.0, "total": 60.0, "productId": ""}, {"id": "p0010", "date": "2026-04-01", "produto": "Coca-cola 2L", "responsavel": "Renata", "qtd": 2, "unit": 13.0, "total": 26.0, "productId": ""}, {"id": "p0011", "date": "2026-04-01", "produto": "Guaraviton", "responsavel": "Renata", "qtd": 1, "unit": 6.0, "total": 6.0, "productId": ""}, {"id": "p0012", "date": "2026-04-01", "produto": "H20 500ml", "responsavel": "Renata", "qtd": 1, "unit": 8.0, "total": 8.0, "productId": ""}, {"id": "p0013", "date": "2026-04-02", "produto": "Brahma 600ml", "responsavel": "Renata", "qtd": 9, "unit": 11.0, "total": 99.0, "productId": ""}, {"id": "p0014", "date": "2026-04-02", "produto": "Cerveja Antartica 1L", "responsavel": "Renata", "qtd": 14, "unit": 13.0, "total": 182.0, "productId": ""}, {"id": "p0015", "date": "2026-04-02", "produto": "Salgado de forno", "responsavel": "Shay", "qtd": 3, "unit": 8.0, "total": 24.0, "productId": ""}, {"id": "p0016", "date": "2026-04-02", "produto": "Corona Long Neck", "responsavel": "Renata", "qtd": 5, "unit": 13.0, "total": 65.0, "productId": ""}, {"id": "p0017", "date": "2026-04-02", "produto": "Guaravita", "responsavel": "Renata", "qtd": 3, "unit": 3.0, "total": 9.0, "productId": ""}, {"id": "p0018", "date": "2026-04-02", "produto": "H20 500ml", "responsavel": "Renata", "qtd": 3, "unit": 8.0, "total": 24.0, "productId": ""}, {"id": "p0019", "date": "2026-04-02", "produto": "Coca-cola lata", "responsavel": "Renata", "qtd": 1, "unit": 6.0, "total": 6.0, "productId": ""}, {"id": "p0020", "date": "2026-04-02", "produto": "Água com gás", "responsavel": "Renata", "qtd": 1, "unit": 4.0, "total": 4.0, "productId": ""}, {"id": "p0021", "date": "2026-04-02", "produto": "Fichas (Sinuca/Totó)", "responsavel": "Renata", "qtd": 3, "unit": 1.0, "total": 3.0, "productId": ""}, {"id": "p0022", "date": "2026-04-02", "produto": "Guaraviton", "responsavel": "Renata", "qtd": 1, "unit": 6.0, "total": 6.0, "productId": ""}, {"id": "p0023", "date": "2026-04-02", "produto": "Gatorade", "responsavel": "Renata", "qtd": 1, "unit": 9.0, "total": 9.0, "productId": ""}, {"id": "p0024", "date": "2026-04-03", "produto": "Água com gás", "responsavel": "Renata", "qtd": 4, "unit": 4.0, "total": 16.0, "productId": ""}, {"id": "p0025", "date": "2026-04-03", "produto": "Água sem gás", "responsavel": "Renata", "qtd": 5, "unit": 3.0, "total": 15.0, "productId": ""}, {"id": "p0026", "date": "2026-04-03", "produto": "H20 500ml", "responsavel": "Renata", "qtd": 4, "unit": 8.0, "total": 32.0, "productId": ""}, {"id": "p0027", "date": "2026-04-03", "produto": "Fichas (Sinuca/Totó)", "responsavel": "Renata", "qtd": 7, "unit": 1.0, "total": 7.0, "productId": ""}, {"id": "p0028", "date": "2026-04-03", "produto": "Coca-cola lata", "responsavel": "Renata", "qtd": 4, "unit": 6.0, "total": 24.0, "productId": ""}, {"id": "p0029", "date": "2026-04-03", "produto": "Guaraviton", "responsavel": "Renata", "qtd": 7, "unit": 6.0, "total": 42.0, "productId": ""}, {"id": "p0030", "date": "2026-04-03", "produto": "Cerveja Antartica 1L", "responsavel": "Renata", "qtd": 40, "unit": 13.0, "total": 520.0, "productId": ""}, {"id": "p0031", "date": "2026-04-03", "produto": "Corona Long Neck", "responsavel": "Renata", "qtd": 1, "unit": 13.0, "total": 13.0, "productId": ""}, {"id": "p0032", "date": "2026-04-03", "produto": "Salgado de forno", "responsavel": "Shay", "qtd": 16, "unit": 8.0, "total": 128.0, "productId": ""}, {"id": "p0033", "date": "2026-04-03", "produto": "Gatorade", "responsavel": "Renata", "qtd": 15, "unit": 9.0, "total": 135.0, "productId": ""}, {"id": "p0034", "date": "2026-04-03", "produto": "Guaravita", "responsavel": "Renata", "qtd": 15, "unit": 3.0, "total": 45.0, "productId": ""}, {"id": "p0035", "date": "2026-04-03", "produto": "Brahma 600ml", "responsavel": "Renata", "qtd": 24, "unit": 11.0, "total": 264.0, "productId": ""}, {"id": "p0036", "date": "2026-04-03", "produto": "Cerveja Budweiser Long Neck", "responsavel": "Renata", "qtd": 3, "unit": 10.0, "total": 30.0, "productId": ""}, {"id": "p0037", "date": "2026-04-03", "produto": "Halls", "responsavel": "Renata", "qtd": 1, "unit": 3.0, "total": 3.0, "productId": ""}, {"id": "p0038", "date": "2026-04-03", "produto": "Guaraná lata", "responsavel": "Renata", "qtd": 2, "unit": 6.0, "total": 12.0, "productId": ""}, {"id": "p0039", "date": "2026-04-03", "produto": "1/2 quadra society (após 17h)", "responsavel": "Renata", "qtd": 2, "unit": 65.0, "total": 130.0, "productId": ""}, {"id": "p0040", "date": "2026-04-03", "produto": "Coca-cola 2L", "responsavel": "Renata", "qtd": 4, "unit": 13.0, "total": 52.0, "productId": ""}, {"id": "p0041", "date": "2026-04-04", "produto": "1/2 hora quadra de areia (até 17h)", "responsavel": "Renata", "qtd": 2, "unit": 28.0, "total": 56.0, "productId": ""}, {"id": "p0042", "date": "2026-04-04", "produto": "Cerveja Antartica 1L", "responsavel": "Renata", "qtd": 19, "unit": 13.0, "total": 247.0, "productId": ""}, {"id": "p0043", "date": "2026-04-04", "produto": "Coca-cola 2L", "responsavel": "Renata", "qtd": 5, "unit": 13.0, "total": 65.0, "productId": ""}, {"id": "p0044", "date": "2026-04-04", "produto": "Coca-cola lata", "responsavel": "Renata", "qtd": 5, "unit": 6.0, "total": 30.0, "productId": ""}, {"id": "p0045", "date": "2026-04-04", "produto": "Guaraviton", "responsavel": "Renata", "qtd": 3, "unit": 6.0, "total": 18.0, "productId": ""}, {"id": "p0046", "date": "2026-04-05", "produto": "Cerveja Antartica 1L", "responsavel": "Renata", "qtd": 19, "unit": 13.0, "total": 247.0, "productId": ""}, {"id": "p0047", "date": "2026-04-05", "produto": "Gatorade", "responsavel": "Renata", "qtd": 2, "unit": 9.0, "total": 18.0, "productId": ""}, {"id": "p0048", "date": "2026-04-05", "produto": "H20 500ml", "responsavel": "Renata", "qtd": 4, "unit": 8.0, "total": 32.0, "productId": ""}, {"id": "p0049", "date": "2026-04-05", "produto": "Água com gás", "responsavel": "Renata", "qtd": 3, "unit": 4.0, "total": 12.0, "productId": ""}, {"id": "p0050", "date": "2026-04-05", "produto": "Água sem gás", "responsavel": "Renata", "qtd": 7, "unit": 3.0, "total": 21.0, "productId": ""}, {"id": "p0051", "date": "2026-04-05", "produto": "Corona Long Neck", "responsavel": "Renata", "qtd": 3, "unit": 13.0, "total": 39.0, "productId": ""}, {"id": "p0052", "date": "2026-04-06", "produto": "Cerveja Antartica 1L", "responsavel": "Renata", "qtd": 16, "unit": 13.0, "total": 208.0, "productId": ""}, {"id": "p0053", "date": "2026-04-06", "produto": "Água sem gás", "responsavel": "Renata", "qtd": 6, "unit": 3.0, "total": 18.0, "productId": ""}, {"id": "p0054", "date": "2026-04-06", "produto": "Guaraviton", "responsavel": "Renata", "qtd": 1, "unit": 6.0, "total": 6.0, "productId": ""}, {"id": "p0055", "date": "2026-04-06", "produto": "Cerveja Budweiser Long Neck", "responsavel": "Renata", "qtd": 2, "unit": 10.0, "total": 20.0, "productId": ""}, {"id": "p0056", "date": "2026-04-06", "produto": "Guaraná lata", "responsavel": "Renata", "qtd": 2, "unit": 6.0, "total": 12.0, "productId": ""}, {"id": "p0057", "date": "2026-04-06", "produto": "Corona Long Neck", "responsavel": "Renata", "qtd": 3, "unit": 13.0, "total": 39.0, "productId": ""}, {"id": "p0058", "date": "2026-04-06", "produto": "1/2 quadra society (após 17h)", "responsavel": "Renata", "qtd": 1, "unit": 65.0, "total": 65.0, "productId": ""}, {"id": "p0059", "date": "2026-04-06", "produto": "Água com gás", "responsavel": "Renata", "qtd": 1, "unit": 4.0, "total": 4.0, "productId": ""}, {"id": "p0060", "date": "2026-04-06", "produto": "Coca-cola lata", "responsavel": "Renata", "qtd": 1, "unit": 6.0, "total": 6.0, "productId": ""}, {"id": "p0061", "date": "2026-04-06", "produto": "Salgado de forno", "responsavel": "Shay", "qtd": 1, "unit": 8.0, "total": 8.0, "productId": ""}, {"id": "p0062", "date": "2026-04-06", "produto": "Gatorade", "responsavel": "Renata", "qtd": 1, "unit": 9.0, "total": 9.0, "productId": ""}, {"id": "p0063", "date": "2026-04-07", "produto": "Corona Long Neck", "responsavel": "Renata", "qtd": 2, "unit": 13.0, "total": 26.0, "productId": ""}, {"id": "p0064", "date": "2026-04-07", "produto": "Salgado de forno", "responsavel": "Shay", "qtd": 7, "unit": 8.0, "total": 56.0, "productId": ""}, {"id": "p0065", "date": "2026-04-07", "produto": "Cerveja Antartica 1L", "responsavel": "Renata", "qtd": 7, "unit": 13.0, "total": 91.0, "productId": ""}, {"id": "p0066", "date": "2026-04-07", "produto": "H20 500ml", "responsavel": "Renata", "qtd": 1, "unit": 8.0, "total": 8.0, "productId": ""}, {"id": "p0067", "date": "2026-04-07", "produto": "Fichas (Sinuca/Totó)", "responsavel": "Renata", "qtd": 2, "unit": 1.0, "total": 2.0, "productId": ""}, {"id": "p0068", "date": "2026-04-07", "produto": "Água sem gás", "responsavel": "Renata", "qtd": 1, "unit": 3.0, "total": 3.0, "productId": ""}, {"id": "p0069", "date": "2026-04-07", "produto": "1/2 quadra society (após 17h)", "responsavel": "Renata", "qtd": 1, "unit": 65.0, "total": 65.0, "productId": ""}, {"id": "p0070", "date": "2026-04-07", "produto": "Guaravita", "responsavel": "Renata", "qtd": 1, "unit": 3.0, "total": 3.0, "productId": ""}, {"id": "p0071", "date": "2026-04-08", "produto": "Cerveja Antartica 1L", "responsavel": "Renata", "qtd": 21, "unit": 13.0, "total": 273.0, "productId": ""}, {"id": "p0072", "date": "2026-04-08", "produto": "Batata", "responsavel": "Shay", "qtd": 1, "unit": 10.0, "total": 10.0, "productId": ""}, {"id": "p0073", "date": "2026-04-08", "produto": "Gatorade", "responsavel": "Renata", "qtd": 1, "unit": 9.0, "total": 9.0, "productId": ""}, {"id": "p0074", "date": "2026-04-08", "produto": "Guaravita", "responsavel": "Renata", "qtd": 1, "unit": 3.0, "total": 3.0, "productId": ""}, {"id": "p0075", "date": "2026-04-08", "produto": "Salgado de forno", "responsavel": "Shay", "qtd": 5, "unit": 8.0, "total": 40.0, "productId": ""}, {"id": "p0076", "date": "2026-04-08", "produto": "Cerveja Budweiser Long Neck", "responsavel": "Renata", "qtd": 1, "unit": 10.0, "total": 10.0, "productId": ""}, {"id": "p0077", "date": "2026-04-08", "produto": "1/2 hora quadra de areia (após 17h)", "responsavel": "Renata", "qtd": 2, "unit": 30.0, "total": 60.0, "productId": ""}, {"id": "p0078", "date": "2026-04-09", "produto": "Água sem gás", "responsavel": "Renata", "qtd": 1, "unit": 3.0, "total": 3.0, "productId": ""}, {"id": "p0079", "date": "2026-04-09", "produto": "Guaravita", "responsavel": "Renata", "qtd": 2, "unit": 3.0, "total": 6.0, "productId": ""}, {"id": "p0080", "date": "2026-04-09", "produto": "Coca-cola lata", "responsavel": "Renata", "qtd": 2, "unit": 6.0, "total": 12.0, "productId": ""}, {"id": "p0081", "date": "2026-04-09", "produto": "Cerveja Antartica 1L", "responsavel": "Renata", "qtd": 5, "unit": 13.0, "total": 65.0, "productId": ""}, {"id": "p0082", "date": "2026-04-09", "produto": "Paçoca", "responsavel": "Renata", "qtd": 2, "unit": 1.5, "total": 3.0, "productId": ""}, {"id": "p0083", "date": "2026-04-09", "produto": "1/2 hora quadra de areia (após 17h)", "responsavel": "Renata", "qtd": 1, "unit": 30.0, "total": 30.0, "productId": ""}, {"id": "p0084", "date": "2026-04-09", "produto": "Banho de sauna", "responsavel": "Renata", "qtd": 1, "unit": 15.0, "total": 15.0, "productId": ""}, {"id": "p0085", "date": "2026-04-09", "produto": "Dose", "responsavel": "Renata", "qtd": 6, "unit": 5.0, "total": 30.0, "productId": ""}, {"id": "p0086", "date": "2026-04-10", "produto": "Cerveja Antartica 1L", "responsavel": "Renata", "qtd": 20, "unit": 13.0, "total": 260.0, "productId": ""}, {"id": "p0087", "date": "2026-04-10", "produto": "Salgado de forno", "responsavel": "Shay", "qtd": 2, "unit": 8.0, "total": 16.0, "productId": ""}, {"id": "p0088", "date": "2026-04-10", "produto": "Guaraviton", "responsavel": "Renata", "qtd": 1, "unit": 6.0, "total": 6.0, "productId": ""}, {"id": "p0089", "date": "2026-04-10", "produto": "Guaravita", "responsavel": "Renata", "qtd": 1, "unit": 3.0, "total": 3.0, "productId": ""}, {"id": "p0090", "date": "2026-04-10", "produto": "H20 500ml", "responsavel": "Renata", "qtd": 1, "unit": 8.0, "total": 8.0, "productId": ""}, {"id": "p0091", "date": "2026-04-10", "produto": "Gatorade", "responsavel": "Renata", "qtd": 1, "unit": 9.0, "total": 9.0, "productId": ""}, {"id": "p0092", "date": "2026-04-10", "produto": "Coca-cola 2L", "responsavel": "Renata", "qtd": 1, "unit": 13.0, "total": 13.0, "productId": ""}, {"id": "p0093", "date": "2026-04-10", "produto": "Coca-cola lata", "responsavel": "Renata", "qtd": 1, "unit": 6.0, "total": 6.0, "productId": ""}, {"id": "p0094", "date": "2026-04-11", "produto": "1/2 hora quadra de areia (até 17h)", "responsavel": "Renata", "qtd": 1, "unit": 28.0, "total": 28.0, "productId": ""}, {"id": "p0095", "date": "2026-04-11", "produto": "1/2 quadra society (até 17h)", "responsavel": "Renata", "qtd": 1, "unit": 50.0, "total": 50.0, "productId": ""}, {"id": "p0096", "date": "2026-04-11", "produto": "Banho de sauna", "responsavel": "Renata", "qtd": 3, "unit": 15.0, "total": 45.0, "productId": ""}, {"id": "p0097", "date": "2026-04-11", "produto": "Suco 1L", "responsavel": "Renata", "qtd": 7, "unit": 8.0, "total": 56.0, "productId": ""}, {"id": "p0098", "date": "2026-04-11", "produto": "Cerveja Antartica 1L", "responsavel": "Renata", "qtd": 10, "unit": 13.0, "total": 130.0, "productId": ""}, {"id": "p0099", "date": "2026-04-12", "produto": "Cerveja Antartica 1L", "responsavel": "Renata", "qtd": 11, "unit": 13.0, "total": 143.0, "productId": ""}, {"id": "p0100", "date": "2026-04-12", "produto": "Coca-cola 2L", "responsavel": "Renata", "qtd": 8, "unit": 13.0, "total": 104.0, "productId": ""}, {"id": "p0101", "date": "2026-04-12", "produto": "H20 500ml", "responsavel": "Renata", "qtd": 1, "unit": 8.0, "total": 8.0, "productId": ""}, {"id": "p0102", "date": "2026-04-12", "produto": "Gatorade", "responsavel": "Renata", "qtd": 4, "unit": 9.0, "total": 36.0, "productId": ""}, {"id": "p0103", "date": "2026-04-12", "produto": "Guaraviton", "responsavel": "Renata", "qtd": 1, "unit": 6.0, "total": 6.0, "productId": ""}, {"id": "p0104", "date": "2026-04-12", "produto": "Guaravita", "responsavel": "Renata", "qtd": 6, "unit": 3.0, "total": 18.0, "productId": ""}, {"id": "p0105", "date": "2026-04-12", "produto": "Guaraná lata", "responsavel": "Renata", "qtd": 3, "unit": 6.0, "total": 18.0, "productId": ""}, {"id": "p0106", "date": "2026-04-12", "produto": "Corona Long Neck", "responsavel": "Renata", "qtd": 3, "unit": 13.0, "total": 39.0, "productId": ""}, {"id": "p0107", "date": "2026-04-12", "produto": "Água com gás", "responsavel": "Renata", "qtd": 3, "unit": 4.0, "total": 12.0, "productId": ""}, {"id": "p0108", "date": "2026-04-12", "produto": "Energético Monster", "responsavel": "Renata", "qtd": 1, "unit": 15.0, "total": 15.0, "productId": ""}, {"id": "p0109", "date": "2026-04-12", "produto": "Água sem gás", "responsavel": "Renata", "qtd": 5, "unit": 3.0, "total": 15.0, "productId": ""}, {"id": "p0110", "date": "2026-04-13", "produto": "Salgado de forno", "responsavel": "Shay", "qtd": 2, "unit": 8.0, "total": 16.0, "productId": ""}, {"id": "p0111", "date": "2026-04-13", "produto": "Água sem gás", "responsavel": "Renata", "qtd": 2, "unit": 3.0, "total": 6.0, "productId": ""}, {"id": "p0112", "date": "2026-04-13", "produto": "Guaravita", "responsavel": "Renata", "qtd": 1, "unit": 3.0, "total": 3.0, "productId": ""}, {"id": "p0113", "date": "2026-04-13", "produto": "Energético Monster", "responsavel": "Renata", "qtd": 1, "unit": 15.0, "total": 15.0, "productId": ""}, {"id": "p0114", "date": "2026-04-13", "produto": "Coca-cola 2L", "responsavel": "Renata", "qtd": 1, "unit": 13.0, "total": 13.0, "productId": ""}, {"id": "p0115", "date": "2026-04-13", "produto": "Banho de sauna", "responsavel": "Renata", "qtd": 1, "unit": 15.0, "total": 15.0, "productId": ""}, {"id": "p0116", "date": "2026-04-13", "produto": "Coca-cola lata", "responsavel": "Renata", "qtd": 1, "unit": 6.0, "total": 6.0, "productId": ""}, {"id": "p0117", "date": "2026-04-13", "produto": "Cerveja Antartica 1L", "responsavel": "Renata", "qtd": 6, "unit": 13.0, "total": 78.0, "productId": ""}, {"id": "p0118", "date": "2026-04-13", "produto": "1/2 quadra society (após 17h)", "responsavel": "Renata", "qtd": 1, "unit": 65.0, "total": 65.0, "productId": ""}, {"id": "p0119", "date": "2026-04-14", "produto": "Cerveja Antartica 1L", "responsavel": "Renata", "qtd": 1, "unit": 13.0, "total": 13.0, "productId": ""}, {"id": "p0120", "date": "2026-04-15", "produto": "Cerveja Antartica 1L", "responsavel": "Renata", "qtd": 34, "unit": 13.0, "total": 442.0, "productId": ""}, {"id": "p0121", "date": "2026-04-15", "produto": "Cerveja Budweiser Long Neck", "responsavel": "Renata", "qtd": 2, "unit": 10.0, "total": 20.0, "productId": ""}, {"id": "p0122", "date": "2026-04-15", "produto": "Guaravita", "responsavel": "Renata", "qtd": 4, "unit": 3.0, "total": 12.0, "productId": ""}, {"id": "p0123", "date": "2026-04-15", "produto": "Paçoca", "responsavel": "Renata", "qtd": 2, "unit": 1.5, "total": 3.0, "productId": ""}, {"id": "p0124", "date": "2026-04-15", "produto": "Água com gás", "responsavel": "Renata", "qtd": 1, "unit": 4.0, "total": 4.0, "productId": ""}, {"id": "p0125", "date": "2026-04-15", "produto": "Salgado de forno", "responsavel": "Shay", "qtd": 7, "unit": 8.0, "total": 56.0, "productId": ""}, {"id": "p0126", "date": "2026-04-15", "produto": "Coca-cola 2L", "responsavel": "Renata", "qtd": 3, "unit": 13.0, "total": 39.0, "productId": ""}, {"id": "p0127", "date": "2026-04-15", "produto": "Guaraviton", "responsavel": "Renata", "qtd": 1, "unit": 6.0, "total": 6.0, "productId": ""}, {"id": "p0128", "date": "2026-04-15", "produto": "Gatorade", "responsavel": "Renata", "qtd": 3, "unit": 9.0, "total": 27.0, "productId": ""}, {"id": "p0129", "date": "2026-04-15", "produto": "Fichas (Sinuca/Totó)", "responsavel": "Renata", "qtd": 6, "unit": 1.0, "total": 6.0, "productId": ""}, {"id": "p0130", "date": "2026-04-15", "produto": "1/2 quadra society (após 17h)", "responsavel": "Renata", "qtd": 2, "unit": 65.0, "total": 130.0, "productId": ""}, {"id": "p0131", "date": "2026-04-16", "produto": "Salgado de forno", "responsavel": "Shay", "qtd": 5, "unit": 8.0, "total": 40.0, "productId": ""}, {"id": "p0132", "date": "2026-04-16", "produto": "Gatorade", "responsavel": "Renata", "qtd": 4, "unit": 9.0, "total": 36.0, "productId": ""}, {"id": "p0133", "date": "2026-04-16", "produto": "Coca-cola lata", "responsavel": "Renata", "qtd": 3, "unit": 6.0, "total": 18.0, "productId": ""}, {"id": "p0134", "date": "2026-04-16", "produto": "Cerveja Antartica 1L", "responsavel": "Renata", "qtd": 4, "unit": 13.0, "total": 52.0, "productId": ""}, {"id": "p0135", "date": "2026-04-16", "produto": "Água sem gás", "responsavel": "Renata", "qtd": 2, "unit": 3.0, "total": 6.0, "productId": ""}, {"id": "p0136", "date": "2026-04-16", "produto": "Guaraviton", "responsavel": "Renata", "qtd": 2, "unit": 6.0, "total": 12.0, "productId": ""}, {"id": "p0137", "date": "2026-04-17", "produto": "Água sem gás", "responsavel": "Renata", "qtd": 1, "unit": 3.0, "total": 3.0, "productId": ""}, {"id": "p0138", "date": "2026-04-17", "produto": "Gatorade", "responsavel": "Renata", "qtd": 2, "unit": 9.0, "total": 18.0, "productId": ""}, {"id": "p0139", "date": "2026-04-17", "produto": "Coca-cola lata", "responsavel": "Renata", "qtd": 1, "unit": 6.0, "total": 6.0, "productId": ""}, {"id": "p0140", "date": "2026-04-17", "produto": "H20 500ml", "responsavel": "Renata", "qtd": 5, "unit": 8.0, "total": 40.0, "productId": ""}, {"id": "p0141", "date": "2026-04-17", "produto": "Cerveja Antartica 1L", "responsavel": "Renata", "qtd": 14, "unit": 13.0, "total": 182.0, "productId": ""}, {"id": "p0142", "date": "2026-04-17", "produto": "Guaraná lata", "responsavel": "Renata", "qtd": 1, "unit": 6.0, "total": 6.0, "productId": ""}, {"id": "p0143", "date": "2026-04-17", "produto": "Salgado de forno", "responsavel": "Shay", "qtd": 3, "unit": 8.0, "total": 24.0, "productId": ""}, {"id": "p0144", "date": "2026-04-17", "produto": "Energético Monster", "responsavel": "Renata", "qtd": 1, "unit": 15.0, "total": 15.0, "productId": ""}, {"id": "p0145", "date": "2026-04-17", "produto": "Água com gás", "responsavel": "Renata", "qtd": 1, "unit": 4.0, "total": 4.0, "productId": ""}, {"id": "p0146", "date": "2026-04-17", "produto": "1/2 quadra society (após 17h)", "responsavel": "Renata", "qtd": 1, "unit": 65.0, "total": 65.0, "productId": ""}, {"id": "p0147", "date": "2026-04-17", "produto": "1/2 hora quadra de areia (após 17h)", "responsavel": "Renata", "qtd": 2, "unit": 30.0, "total": 60.0, "productId": ""}, {"id": "p0148", "date": "2026-04-18", "produto": "1/2 hora quadra de areia (até 17h)", "responsavel": "Renata", "qtd": 1, "unit": 28.0, "total": 28.0, "productId": ""}, {"id": "p0149", "date": "2026-04-18", "produto": "1/2 quadra society (até 17h)", "responsavel": "Renata", "qtd": 2, "unit": 50.0, "total": 100.0, "productId": ""}, {"id": "p0150", "date": "2026-04-18", "produto": "1/2 hora quadra de areia (até 17h)", "responsavel": "Renata", "qtd": 1, "unit": 28.0, "total": 28.0, "productId": ""}, {"id": "p0151", "date": "2026-04-18", "produto": "Cerveja Brahma 1L", "responsavel": "Renata", "qtd": 10, "unit": 13.0, "total": 130.0, "productId": ""}, {"id": "p0152", "date": "2026-04-18", "produto": "Coca-cola 2L", "responsavel": "Renata", "qtd": 4, "unit": 13.0, "total": 52.0, "productId": ""}, {"id": "p0153", "date": "2026-04-18", "produto": "Água com gás", "responsavel": "Renata", "qtd": 11, "unit": 4.0, "total": 44.0, "productId": ""}, {"id": "p0154", "date": "2026-04-19", "produto": "Cerveja Antartica 1L", "responsavel": "Renata", "qtd": 13, "unit": 13.0, "total": 169.0, "productId": ""}, {"id": "p0155", "date": "2026-04-19", "produto": "Água sem gás", "responsavel": "Renata", "qtd": 3, "unit": 3.0, "total": 9.0, "productId": ""}, {"id": "p0156", "date": "2026-04-19", "produto": "Coca-cola lata", "responsavel": "Renata", "qtd": 5, "unit": 6.0, "total": 30.0, "productId": ""}, {"id": "p0157", "date": "2026-04-19", "produto": "Guaraná lata", "responsavel": "Renata", "qtd": 1, "unit": 6.0, "total": 6.0, "productId": ""}, {"id": "p0158", "date": "2026-04-19", "produto": "Guaraviton", "responsavel": "Renata", "qtd": 3, "unit": 6.0, "total": 18.0, "productId": ""}, {"id": "p0159", "date": "2026-04-19", "produto": "Gatorade", "responsavel": "Renata", "qtd": 5, "unit": 9.0, "total": 45.0, "productId": ""}, {"id": "p0160", "date": "2026-04-19", "produto": "H20 500ml", "responsavel": "Renata", "qtd": 3, "unit": 8.0, "total": 24.0, "productId": ""}, {"id": "p0161", "date": "2026-04-19", "produto": "Cerveja Budweiser Long Neck", "responsavel": "Renata", "qtd": 3, "unit": 10.0, "total": 30.0, "productId": ""}, {"id": "p0162", "date": "2026-04-19", "produto": "Corona Long Neck", "responsavel": "Renata", "qtd": 3, "unit": 13.0, "total": 39.0, "productId": ""}, {"id": "p0163", "date": "2026-04-19", "produto": "Guaravita", "responsavel": "Renata", "qtd": 23, "unit": 3.0, "total": 69.0, "productId": ""}, {"id": "p0164", "date": "2026-04-19", "produto": "Banho de sauna", "responsavel": "Renata", "qtd": 3, "unit": 15.0, "total": 45.0, "productId": ""}, {"id": "p0165", "date": "2026-04-20", "produto": "1/2 hora quadra de areia (após 17h)", "responsavel": "Renata", "qtd": 1, "unit": 30.0, "total": 30.0, "productId": ""}, {"id": "p0166", "date": "2026-04-20", "produto": "Cerveja Antartica 1L", "responsavel": "Renata", "qtd": 3, "unit": 13.0, "total": 39.0, "productId": ""}, {"id": "p0167", "date": "2026-04-20", "produto": "Salgado de forno", "responsavel": "Shay", "qtd": 1, "unit": 8.0, "total": 8.0, "productId": ""}, {"id": "p0168", "date": "2026-04-20", "produto": "H20 500ml", "responsavel": "Renata", "qtd": 1, "unit": 8.0, "total": 8.0, "productId": ""}, {"id": "p0169", "date": "2026-04-20", "produto": "Coca-cola 2L", "responsavel": "Renata", "qtd": 1, "unit": 13.0, "total": 13.0, "productId": ""}, {"id": "p0170", "date": "2026-04-20", "produto": "Gatorade", "responsavel": "Renata", "qtd": 1, "unit": 9.0, "total": 9.0, "productId": ""}, {"id": "p0171", "date": "2026-04-20", "produto": "Banho de sauna", "responsavel": "Renata", "qtd": 1, "unit": 15.0, "total": 15.0, "productId": ""}, {"id": "p0172", "date": "2026-04-20", "produto": "1/2 hora quadra de areia (após 17h)", "responsavel": "Renata", "qtd": 2, "unit": 30.0, "total": 60.0, "productId": ""}, {"id": "p0173", "date": "2026-04-20", "produto": "1/2 quadra society (após 17h)", "responsavel": "Renata", "qtd": 1, "unit": 65.0, "total": 65.0, "productId": ""}, {"id": "p0174", "date": "2026-04-26", "produto": "1/2 hora quadra de areia (até 17h)", "responsavel": "Renata", "qtd": 1, "unit": 28.0, "total": 28.0, "productId": ""}];

const preloadClosings = [{"date": "2026-04-01", "maquina": 302.0, "responsavel": "Renata", "obs": ""}, {"date": "2026-04-02", "maquina": 416.0, "responsavel": "Renata", "obs": ""}, {"date": "2026-04-03", "maquina": 1446.8, "responsavel": "Renata", "obs": ""}, {"date": "2026-04-04", "maquina": 386.0, "responsavel": "Renata", "obs": ""}, {"date": "2026-04-05", "maquina": 310.0, "responsavel": "Renata", "obs": ""}, {"date": "2026-04-06", "maquina": 226.0, "responsavel": "Renata", "obs": ""}, {"date": "2026-04-07", "maquina": 199.0, "responsavel": "Renata", "obs": ""}, {"date": "2026-04-08", "maquina": 362.0, "responsavel": "Renata", "obs": ""}, {"date": "2026-04-09", "maquina": 74.0, "responsavel": "Renata", "obs": ""}, {"date": "2026-04-10", "maquina": 364.0, "responsavel": "Renata", "obs": ""}, {"date": "2026-04-11", "maquina": 285.0, "responsavel": "Renata", "obs": ""}, {"date": "2026-04-12", "maquina": 386.3, "responsavel": "Renata", "obs": ""}, {"date": "2026-04-13", "maquina": 145.99, "responsavel": "Renata", "obs": ""}, {"date": "2026-04-14", "maquina": 13.0, "responsavel": "Renata", "obs": ""}, {"date": "2026-04-15", "maquina": 572.0, "responsavel": "Renata", "obs": ""}, {"date": "2026-04-16", "maquina": 152.0, "responsavel": "Renata", "obs": ""}, {"date": "2026-04-17", "maquina": 342.0, "responsavel": "Renata", "obs": ""}, {"date": "2026-04-18", "maquina": 382.0, "responsavel": "Renata", "obs": ""}, {"date": "2026-04-19", "maquina": 464.0, "responsavel": "Renata", "obs": ""}, {"date": "2026-04-20", "maquina": 131.0, "responsavel": "Renata", "obs": ""}];


// ─── localStorage DB ─────────────────────────────────────────────────────────
const db = {
  get sales()    { return getLS('sales',    preloadSales) },
  get products() { return getLS('products', defaultProducts) },
  get moves()    { return getLS('moves',    []) },
  get closings() { return getLS('closings', preloadClosings) },
  set sales(v)    { setLS('sales',    v) },
  set products(v) { setLS('products', v) },
  set moves(v)    { setLS('moves',    v) },
  set closings(v) { setLS('closings', v) },
}
const getStone = () => getLS('stoneData', preloadStone)
const saveStone = (v) => setLS('stoneData', v)
const getContagens = () => getLS('contagensMes', {})
const saveContagens = (v) => setLS('contagensMes', v)

const NAV = [
  {id:'dashboard',  label:'Dashboard'},
  {id:'venda',      label:'Venda'},
  {id:'entrada',    label:'Entrada'},
  {id:'baixa',      label:'Baixa'},
  {id:'estoque',    label:'Estoque'},
  {id:'caixa',      label:'Caixa'},
  {id:'relatorios', label:'Relatórios'},
  {id:'conferencia',label:'Conferência'},
  {id:'produtos',     label:'Cardápio'},
  {id:'estoquefinal', label:'Est. Final'},
  {id:'login',        label:'Sair'},
];

const NAV_ICONS = {
  dashboard:'🏎️', venda:'🛒', entrada:'🚚', baixa:'⬇️', estoque:'📦',
  caixa:'🔒', relatorios:'📊', conferencia:'☑️', produtos:'🍽️', estoquefinal:'🔍', login:'🚪'
};

export default function App() {
  const [page, setPage] = useState('login');
  const [drawer, setDrawer] = useState(false);
  const [tick, setTick] = useState(0);
  const refresh = () => setTick(t=>t+1);
  const nav = (p) => { setPage(p); setDrawer(false); };

  if(page === 'login') return <Login onLogin={()=>nav('dashboard')} />;

  return (
    <div style={{minHeight:'100vh',background:'#f5f6fa'}}>
        <header className="hdr">
          <div className="hdr-brand">🥤 Bar do Complexo</div>
          <nav className="hdr-nav">
            {NAV.filter(n=>n.id!=='login').map(n=>(
              <button key={n.id} className={"hdr-nav-item "+(page===n.id?'active':'')} onClick={()=>nav(n.id)}>
                {NAV_ICONS[n.id]} {n.label}
              </button>
            ))}
          </nav>
          <button className="hdr-ham" onClick={()=>setDrawer(true)}>
            <span/><span/><span/>
          </button>
        </header>

        {drawer && <>
          <div className="ov" onClick={()=>setDrawer(false)}/>
          <div className="drawer">
            <div className="drawer-top">
              <div className="drawer-brand">🥤 Bar do Complexo</div>
              <button className="hdr-ham" onClick={()=>setDrawer(false)}><span/><span/><span/></button>
            </div>
            {NAV.map(n=>(
              <button key={n.id} className={`di ${page===n.id?'active':''}`} onClick={()=>nav(n.id)}>
                <span>{NAV_ICONS[n.id]}</span>{n.label}
              </button>
            ))}
          </div>
        </>}

        <div className="main">
          {page==='dashboard'    && <Dashboard   nav={nav} refresh={refresh} tick={tick}/>}
          {page==='venda'        && <Venda        nav={nav} refresh={refresh}/>}
          {page==='entrada'      && <Entrada       refresh={refresh}/>}
          {page==='baixa'        && <Baixa         refresh={refresh}/>}
          {page==='estoque'      && <Estoque       nav={nav} tick={tick}/>}
          {page==='caixa'        && <Caixa         nav={nav} refresh={refresh} tick={tick}/>}
          {page==='relatorios'   && <Relatorios    tick={tick}/>}
          {page==='conferencia'  && <Conferencia   tick={tick}/>}
          {page==='produtos'     && <Produtos       refresh={refresh} tick={tick}/>}
          {page==='estoquefinal' && <EstoqueFinal    refresh={refresh} tick={tick}/>}
        </div>
      </div>
  );
}

function Login({onLogin}) {
  const [pw,setPw]=useState('');
  return (
    <div className="login-bg">
        <div className="login-card">
          <div style={{fontSize:44,marginBottom:8}}>🥤</div>
          <div style={{fontSize:22,fontWeight:800,marginBottom:4}}>Bar do Complexo</div>
          <div style={{fontSize:13,color:'#9ca3af',marginBottom:28}}>Sistema de gestão interno</div>
          <input className="fi" type="password" placeholder="Senha" value={pw}
            onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&onLogin()}
            style={{marginBottom:16}}/>
          <button className="btn btn-p btn-full" onClick={onLogin}>Entrar</button>
          <div style={{marginTop:12,fontSize:12,color:'#9ca3af'}}>Protótipo — senha livre por enquanto</div>
        </div>
      </div>
  );
}

function Dashboard({nav, refresh, tick}) {
  const [from,setFrom]=useState(todayStr());
  const [to,setTo]=useState(todayStr());
  const [applied,setApplied]=useState({from:todayStr(),to:todayStr()});

  const period=db.sales.filter(s=>s.date>=applied.from&&s.date<=applied.to);
  const total=period.reduce((a,s)=>a+s.total,0);
  const renata=period.filter(s=>s.responsavel==='Renata').reduce((a,s)=>a+s.total,0);
  const shay=period.filter(s=>s.responsavel==='Shay').reduce((a,s)=>a+s.total,0);
  const qtd=period.reduce((a,s)=>a+s.qtd,0);
  const isOneDay=applied.from===applied.to;
  const close=isOneDay?db.closings.find(c=>c.date===applied.from):null;
  const maquina=close?.maquina||0;
  const dinheiro=total-maquina;

  return (
    <div>
      <div className="pg-hdr"><div className="pg-title">🏎️ Dashboard</div></div>
      <div className="df-row">
        <span className="df-lbl">De</span>
        <input type="date" className="df-in" value={from} onChange={e=>setFrom(e.target.value)}/>
        <span className="df-lbl">Até</span>
        <input type="date" className="df-in" value={to} onChange={e=>setTo(e.target.value)}/>
        <button className="btn btn-p btn-sm" onClick={()=>setApplied({from,to})}>🔍 Ver</button>
      </div>

      <div className="sg">
        <div className="sc c-navy"><div className="sc-lbl">💵 Total do Dia</div><div className="sc-val">{R(total)}</div></div>
        <div className="sc c-purple"><div className="sc-lbl">👤 Renata</div><div className="sc-val">{R(renata)}</div></div>
        <div className="sc c-orange"><div className="sc-lbl">👤 Shay</div><div className="sc-val">{R(shay)}</div></div>
        <div className="sc c-teal"><div className="sc-lbl">🛍️ Itens Vendidos</div><div className="sc-val">{qtd}</div></div>
        {close && <>
          <div className="sc c-blue"><div className="sc-lbl">💳 Maquininha/PIX</div><div className="sc-val">{R(maquina)}</div></div>
          <div className="sc c-green"><div className="sc-lbl">💵 Dinheiro</div><div className="sc-val">{R(dinheiro)}</div></div>
        </>}
      </div>

      <div className={`alert ${close?'ao':'aw'}`}>
        <span>{close
          ? <><strong>✅ Fechamento registrado</strong> por {close.responsavel}</>
          : <>⚠ <strong>Fechamento pendente</strong></>}
        </span>
        {close
          ? <button className="btn btn-og btn-sm" onClick={()=>nav('caixa')}>✏️ Editar</button>
          : <button className="btn btn-a btn-sm" onClick={()=>nav('caixa')}>🔒 Fechar Caixa</button>}
      </div>

      <div className="sec">
        <div className="sec-hdr">
          <div className="sec-ttl">☰ Vendas do Dia</div>
          <button className="btn btn-p btn-sm" onClick={()=>nav('venda')}>+ Nova Venda</button>
        </div>
        {period.length ? (
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Responsável</th><th>Produto</th><th>Qtd</th><th>Unit.</th><th>Total</th><th></th></tr></thead>
              <tbody>{period.map(s=>(
                <tr key={s.id}>
                  <td>{s.responsavel}</td><td>{s.produto}</td>
                  <td>{s.qtd}</td><td>{R(s.unit)}</td>
                  <td className="fw">{R(s.total)}</td>
                  <td>
                    <div style={{display:'flex',gap:4}}>
                      <button
                        title="Editar quantidade"
                        onClick={()=>{
                          const novaQtd = window.prompt('Nova quantidade:', String(s.qtd));
                          if(novaQtd===null) return;
                          const qtdNum = parseInt(novaQtd);
                          if(!qtdNum || qtdNum < 1) return alert('Quantidade inválida');
                          db.sales = db.sales.map(x=>x.id===s.id ? {...x, qtd:qtdNum, total:x.unit*qtdNum} : x);
                          refresh();
                        }}
                        style={{background:'none',border:'1.5px solid #2563eb',borderRadius:7,cursor:'pointer',padding:'4px 6px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button
                        title="Apagar venda"
                        onClick={()=>{ if(window.confirm('Apagar esta venda?')){ db.sales = db.sales.filter(x=>x.id!==s.id); refresh(); } }}
                        style={{background:'none',border:'1.5px solid #dc2626',borderRadius:7,cursor:'pointer',padding:'4px 6px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : (
          <div className="empty">
            <div style={{fontSize:38,marginBottom:10,opacity:.4}}>📥</div>
            <div style={{marginBottom:14}}>Nenhuma venda no período.</div>
            <button className="btn btn-p" onClick={()=>nav('venda')}>+ Registrar Venda</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Venda({nav, refresh}) {
  const [date,setDate]=useState(todayStr());
  const [pid,setPid]=useState('');
  const [qtd,setQtd]=useState(1);
  const [resp,setResp]=useState('Renata');
  const [ok,setOk]=useState(false);
  const products=db.products.filter(p=>p.ativo);
  const p=products.find(x=>x.id===pid);
  const total=(p?.preco||0)*qtd;

  function handleProduto(id){
    setPid(id);
    const prod=products.find(x=>x.id===id);
    if(prod) setResp(prod.responsavel);
  }

  function save(){
    if(!p) return alert('Selecione o produto');
    db.sales = [...db.sales, {id:uid(),date,productId:p.id,produto:p.nome,qtd,unit:p.preco,total,responsavel:resp}];
    setOk(true); setPid(''); setQtd(1); refresh(); setTimeout(()=>setOk(false),3000);
  }

  return (
    <div>
      <div className="pg-hdr">
        <div className="pg-title">🛒 Registrar Venda</div>
        <button className="pg-back" onClick={()=>nav('dashboard')}>← Dashboard</button>
      </div>
      {ok && <div className="alert ao mb4">✅ Venda registrada!</div>}
      <div className="card">
        <div className="field">
          <label>Data</label>
          <div className="fi-ro">{fmtDate(date)}</div>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}
            style={{marginTop:6,width:'100%',padding:'8px 12px',border:'1.5px solid #d1d5db',borderRadius:8,fontSize:13}}/>
        </div>
        <div className="field">
          <label>Produto</label>
          <select className="fi" value={pid} onChange={e=>handleProduto(e.target.value)}>
            <option value="">Selecione o produto...</option>
            {['Serviço','Bar','Comida'].map(cat=>(
              <optgroup key={cat} label={`── ${cat} ──`}>
                {products.filter(x=>x.categoria===cat).map(x=>(
                  <option key={x.id} value={x.id}>{x.nome} — {R(x.preco)}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Quantidade</label>
          <div className="qty-row">
            <button className="qty-btn" onClick={()=>setQtd(Math.max(1,qtd-1))}>−</button>
            <input className="qty-val" type="number" value={qtd} onChange={e=>setQtd(Math.max(1,+e.target.value||1))}/>
            <button className="qty-btn" onClick={()=>setQtd(qtd+1)}>+</button>
          </div>
        </div>
        <div className="field">
          <label>Responsável</label>
          <div className="rr">
            <label><input type="radio" name="rv" checked={resp==='Renata'} onChange={()=>setResp('Renata')}/> Renata</label>
            <label><input type="radio" name="rv" checked={resp==='Shay'}   onChange={()=>setResp('Shay')}/> Shay</label>
          </div>
        </div>
        {p && <div className="tbox"><span className="tbox-l">Total:</span><span className="tbox-v">{R(total)}</span></div>}
        <button className="btn btn-s btn-full" onClick={save}>✓ Confirmar Venda</button>
      </div>
    </div>
  );
}

function Entrada({refresh}) {
  const [date,setDate]=useState(todayStr());
  const [pid,setPid]=useState('');
  const [qtd,setQtd]=useState(1);
  const [obs,setObs]=useState('');
  const [ok,setOk]=useState(false);
  const products=db.products.filter(p=>p.ativo);

  function save(){
    const p=products.find(x=>x.id===pid);
    if(!p) return alert('Selecione o produto');
    db.moves = [...db.moves, {id:uid(),date,productId:p.id,produto:p.nome,type:'entrada',qtd,obs}];
    setOk(true); setPid(''); setQtd(1); setObs('');
    refresh(); setTimeout(()=>setOk(false),3000);
  }

  return (
    <div>
      <div className="pg-hdr"><div className="pg-title">🚚 Entrada de Mercadoria</div></div>
      {ok && <div className="alert ao mb4">✅ Entrada registrada!</div>}
      <div className="card">
        <div className="field"><label>Data</label>
          <div className="fi-ro">{fmtDate(date)}</div>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}
            style={{marginTop:6,width:'100%',padding:'8px 12px',border:'1.5px solid #d1d5db',borderRadius:8,fontSize:13}}/></div>
        <div className="field"><label>Produto</label>
          <select className="fi" value={pid} onChange={e=>setPid(e.target.value)}>
            <option value="">Selecione...</option>
            {products.map(x=><option key={x.id} value={x.id}>{x.nome}</option>)}
          </select></div>
        <div className="field"><label>Quantidade recebida</label>
          <input className="fi" type="number" value={qtd} onChange={e=>setQtd(+e.target.value||1)}/></div>
        <div className="field"><label>Observação <span className="opt">(opcional)</span></label>
          <input className="fi" value={obs} onChange={e=>setObs(e.target.value)} placeholder="Ex: NF 1234, fornecedor..."/></div>
        <button className="btn btn-p btn-full" onClick={save}>🚚 Registrar Entrada</button>
      </div>
    </div>
  );
}

function Baixa({refresh}) {
  const [date,setDate]=useState(todayStr());
  const [pid,setPid]=useState('');
  const [qtd,setQtd]=useState(1);
  const [motivo,setMotivo]=useState('Vencido');
  const [obs,setObs]=useState('');
  const [ok,setOk]=useState(false);
  const products=db.products.filter(p=>p.ativo);

  function save(){
    const p=products.find(x=>x.id===pid);
    if(!p) return alert('Selecione o produto');
    db.moves = [...db.moves, {id:uid(),date,productId:p.id,produto:p.nome,type:'baixa',qtd,motivo,obs}];
    setOk(true); setPid(''); setQtd(1); setObs('');
    refresh(); setTimeout(()=>setOk(false),3000);
  }

  return (
    <div>
      <div className="pg-hdr">
        <div className="pg-title" style={{color:'#dc2626'}}>
          <span style={{width:28,height:28,border:'2px solid #dc2626',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>↓</span>
          Baixa de Estoque
        </div>
      </div>
      <p style={{color:'#6b7280',fontSize:14,marginBottom:16}}>Use para registrar perdas que não são vendas: vencimento, produto estragado, quebra, etc.</p>
      {ok && <div className="alert ao mb4">✅ Baixa registrada!</div>}
      <div className="card">
        <div className="field"><label>Data</label>
          <div className="fi-ro">{fmtDate(date)}</div>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}
            style={{marginTop:6,width:'100%',padding:'8px 12px',border:'1.5px solid #d1d5db',borderRadius:8,fontSize:13}}/></div>
        <div className="field"><label>Produto</label>
          <select className="fi" value={pid} onChange={e=>setPid(e.target.value)}>
            <option value="">Selecione...</option>
            {products.map(x=><option key={x.id} value={x.id}>{x.nome}</option>)}
          </select></div>
        <div className="field"><label>Quantidade</label>
          <input className="fi" type="number" value={qtd} onChange={e=>setQtd(+e.target.value||1)}/></div>
        <div className="field"><label>Motivo</label>
          <select className="fi" value={motivo} onChange={e=>setMotivo(e.target.value)}>
            {['Vencido','Quebra','Produto estragado','Outro'].map(m=><option key={m}>{m}</option>)}
          </select></div>
        <div className="field"><label>Observação <span className="opt">(opcional)</span></label>
          <input className="fi" value={obs} onChange={e=>setObs(e.target.value)} placeholder="Ex: lote 1234, geladeira quebrou..."/></div>
        <button className="btn btn-d btn-full" onClick={save}>↓ Registrar Baixa</button>
      </div>
    </div>
  );
}

function Estoque({nav, tick}) {
  const products=db.products.filter(p=>p.ativo);
  function calc(id){
    const ent=db.moves.filter(m=>m.productId===id&&m.type==='entrada').reduce((a,m)=>a+m.qtd,0);
    const bai=db.moves.filter(m=>m.productId===id&&m.type==='baixa').reduce((a,m)=>a+m.qtd,0);
    const sai=db.sales.filter(s=>s.productId===id).reduce((a,s)=>a+s.qtd,0);
    return {ent,sai:sai+bai,est:ent-sai-bai};
  }
  return (
    <div>
      <div className="pg-hdr">
        <div className="pg-title">📦 Estoque Atual</div>
        <button className="btn btn-p btn-sm" onClick={()=>nav('entrada')}>🚚 Entrada de Mercadoria</button>
      </div>
      <div className="legend">
        <span className="leg" style={{background:'#ef4444',color:'#fff'}}>Zerado ou negativo</span>
        <span className="leg" style={{background:'#f59e0b',color:'#fff'}}>Baixo (≤ 5)</span>
        <span className="leg" style={{border:'1.5px solid #d1d5db',color:'#374151',background:'#fff'}}>Normal</span>
      </div>
      <div className="sec">
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Produto</th><th>Responsável</th><th>Preço</th><th>Entradas</th><th>Saídas</th><th>Estoque</th></tr></thead>
            <tbody>{products.map(p=>{
              const c=calc(p.id);
              return <tr key={p.id}>
                <td>{p.nome}</td><td>{p.responsavel}</td><td>{R(p.preco)}</td>
                <td className="tg fw">{c.ent}</td>
                <td className="tr fw">{c.sai}</td>
                <td>{c.est<=0?<span className="stk-r">{c.est}</span>:c.est<=5?<span className="stk-a">{c.est}</span>:<span className="stk-ok">{c.est}</span>}</td>
              </tr>;
            })}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Caixa({nav, refresh, tick}) {
  const [date,setDate]=useState(todayStr());
  const [applied,setApplied]=useState(todayStr());
  const [maquina,setMaquina]=useState('');
  const [resp,setResp]=useState('Renata');
  const [obs,setObs]=useState('');
  const [ok,setOk]=useState(false);

  const total=db.sales.filter(s=>s.date===applied).reduce((a,s)=>a+s.total,0);
  const close=db.closings.find(c=>c.date===applied);
  const maq=Number((maquina||String(close?.maquina||0)).replace(',','.'))||0;
  const dinheiro=total-maq;

  function save(){
    db.closings = [...db.closings.filter(c=>c.date!==applied), {date:applied,maquina:maq,responsavel:resp,obs}];
    setOk(true); refresh(); setTimeout(()=>setOk(false),3000);
  }
  function del(){db.closings = db.closings.filter(c=>c.date!==applied); refresh();}

  return (
    <div>
      <div className="pg-hdr">
        <div className="pg-title">🔒 Fechamento do Caixa</div>
        <button className="pg-back" onClick={()=>nav('dashboard')}>← Dashboard</button>
      </div>
      <div className="card mb4">
        <div className="date-row">
          <div className="date-row-v">{fmtDate(date)}</div>
          <button className="date-row-b" onClick={()=>setApplied(date)}>Ver</button>
        </div>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)}
          style={{marginTop:6,width:'100%',padding:'8px 12px',border:'1.5px solid #d1d5db',borderRadius:8,fontSize:13}}/>
      </div>
      {ok && <div className="alert ao mb4">✅ Fechamento registrado!</div>}
      {close && (
        <div className="cxc mb4">
          <div className="cxc-hdr">✓ Conferência do Dia</div>
          <div className="cxc-body">
            <div className="cxc-grid">
              <div className="cxm cxm-bl"><div className="cxm-lbl">Total Vendas</div><div className="cxm-val">{R(total)}</div></div>
              <div className="cxm cxm-ye"><div className="cxm-lbl">Maquininha Declarado</div><div className="cxm-val">{R(close.maquina)}</div></div>
              <div className="cxm cxm-gr" style={{gridColumn:'1/-1'}}><div className="cxm-lbl">Dinheiro (implícito)</div><div className="cxm-val">{R(total-close.maquina)}</div></div>
            </div>
            <button className="btn btn-do btn-full" onClick={del}>🗑 Apagar fechamento</button>
          </div>
        </div>
      )}
      <div className="card">
        <div className="field"><label>Total do Dia (vendas registradas)</label>
          <div className="fi-r">{R(total)}</div></div>
        <div className="field"><label>Total Maquininha/PIX (R$)</label>
          <input className="fi" placeholder="0,00" value={maquina} onChange={e=>setMaquina(e.target.value)}/>
          <div style={{fontSize:13,color:'#6b7280',marginTop:4}}>Digite o total que passou na maquininha/PIX no dia.</div></div>
        <div className="cash-box mb4">
          <div className="cr"><span>Dinheiro (implícito):</span><span className="cv">{R(dinheiro)}</span></div>
          <div className="cr"><span>Maquininha/PIX:</span><span className="cv">{R(maq)}</span></div>
        </div>
        <div className="field"><label>Responsável pelo Fechamento</label>
          <select className="fi" value={resp} onChange={e=>setResp(e.target.value)}>
            <option>Renata</option><option>Shay</option>
          </select></div>
        <div className="field"><label>Observação <span className="opt">(opcional)</span></label>
          <input className="fi" placeholder="Ex: faltou trocar, teve sangria..." value={obs} onChange={e=>setObs(e.target.value)}/></div>
        <button className="btn btn-s btn-full" onClick={save}>🔒 Registrar Fechamento</button>
      </div>
    </div>
  );
}

function Relatorios({tick}) {
  const [from,setFrom]=useState('2026-04-01');
  const [to,setTo]=useState(todayStr());
  const [applied,setApplied]=useState({from:'2026-04-01',to:todayStr()});

  const period=db.sales.filter(s=>s.date>=applied.from&&s.date<=applied.to);
  const total=period.reduce((a,s)=>a+s.total,0);
  const dates=[...new Set(period.map(s=>s.date))].sort();
  const maq=db.closings.filter(c=>c.date>=applied.from&&c.date<=applied.to).reduce((a,c)=>a+c.maquina,0);
  const dinheiro=total-maq;
  const renata=period.filter(s=>s.responsavel==='Renata').reduce((a,s)=>a+s.total,0);
  const shay=period.filter(s=>s.responsavel==='Shay').reduce((a,s)=>a+s.total,0);
  const taxa=shay*0.0475;

  const prod={};
  period.forEach(s=>{prod[s.produto]??={qtd:0,receita:0}; prod[s.produto].qtd+=s.qtd; prod[s.produto].receita+=s.total;});
  const top=Object.entries(prod).sort((a,b)=>b[1].qtd-a[1].qtd).slice(0,10);

  const wkeys=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const week={Dom:[],Seg:[],Ter:[],Qua:[],Qui:[],Sex:[],Sáb:[]};
  dates.forEach(d=>{
    const t=period.filter(s=>s.date===d).reduce((a,s)=>a+s.total,0);
    week[wkeys[new Date(d+'T12:00:00').getDay()]].push(t);
  });
  const weekAvg=wkeys.map(k=>({k,v:week[k].length?week[k].reduce((a,b)=>a+b,0)/week[k].length:0}));
  const maxW=Math.max(...weekAvg.map(x=>x.v),1);

  const months={};
  db.sales.forEach(s=>{
    const ym=s.date.slice(0,7);
    months[ym]??={total:0,renata:0,shay:0};
    months[ym].total+=s.total;
    if(s.responsavel==='Renata') months[ym].renata+=s.total;
    else months[ym].shay+=s.total;
  });

  return (
    <div>
      <div className="pg-hdr">
        <div className="pg-title">📊 Relatórios</div>
        <div style={{display:'flex',gap:6}}>
          <button className="btn btn-op btn-sm" style={{fontSize:12}}>📋 Exportar Período</button>
          <button className="btn btn-s btn-sm" style={{fontSize:12}}>⬇️ Exportar Tudo</button>
        </div>
      </div>

      <div className="card mb4">
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
          <div><div style={{fontSize:13,fontWeight:700,marginBottom:4}}>De</div>
            <input className="df-in" style={{width:'100%'}} type="date" value={from} onChange={e=>setFrom(e.target.value)}/></div>
          <div><div style={{fontSize:13,fontWeight:700,marginBottom:4}}>Até</div>
            <input className="df-in" style={{width:'100%'}} type="date" value={to} onChange={e=>setTo(e.target.value)}/></div>
        </div>
        <button className="btn btn-p btn-sm" onClick={()=>setApplied({from,to})}>🔍 Filtrar</button>
      </div>

      <div className="sg mb4">
        <div className="sc c-navy"><div className="sc-lbl">Total do Período</div><div className="sc-val">{R(total)}</div></div>
        <div className="sc c-green"><div className="sc-lbl">Dinheiro</div><div className="sc-val">{R(dinheiro)}</div><div className="sc-sub">{total?((dinheiro/total)*100).toFixed(1)+'%':''}</div></div>
        <div className="sc c-blue"><div className="sc-lbl">Maquininha/PIX</div><div className="sc-val">{R(maq)}</div><div className="sc-sub">{total?((maq/total)*100).toFixed(1)+'%':''}</div></div>
        <div className="sc c-ltgreen"><div className="sc-lbl">Dias Trabalhados</div><div className="sc-val">{dates.length}</div><div className="sc-sub">Média {R(dates.length?total/dates.length:0)}/dia</div></div>
      </div>

      {/* por responsável */}
      <div className="sec mb4">
        <div className="sec-hdr"><div className="sec-ttl">👥 Por Responsável</div></div>
        <div className="sec-body">
          <div style={{display:'flex',justifyContent:'space-between',fontSize:14,marginBottom:4}}><b>Renata</b><span>{R(renata)} ({total?((renata/total)*100).toFixed(1):0}%)</span></div>
          <div className="pb"><div className="pf" style={{width:(total?renata/total*100:0)+'%',background:'#7c3aed'}}/></div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:14,marginBottom:4}}><b>Shay</b><span>{R(shay)} ({total?((shay/total)*100).toFixed(1):0}%)</span></div>
          <div className="pb"><div className="pf" style={{width:(total?shay/total*100:0)+'%',background:'#f97316'}}/></div>
          <div className="shay-box">
            <div className="sr"><span>Bruto</span><b>{R(shay)}</b></div>
            <div className="sr"><span>Desconto taxa (4,75%)</span><b style={{color:'#dc2626'}}>– {R(taxa)}</b></div>
            <hr style={{margin:'8px 0',borderColor:'#fde68a'}}/>
            <div className="sr"><b>Líquido a receber</b><b style={{color:'#16a34a',fontSize:16}}>{R(shay-taxa)}</b></div>
          </div>
        </div>
      </div>

      {/* media por dia */}
      <div className="sec mb4">
        <div className="sec-hdr"><div className="sec-ttl">📅 Média por Dia da Semana</div></div>
        <div className="sec-body">
          {weekAvg.map(({k,v})=>(
            <div key={k} className="wr">
              <span style={{width:36,fontSize:13}}>{k}</span>
              <div className="wb"><div className="wf" style={{width:(v/maxW*100)+'%'}}/></div>
              <span style={{fontSize:13,fontWeight:600,minWidth:90,textAlign:'right'}}>{R(v)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* top 10 */}
      <div className="sec mb4">
        <div className="sec-hdr"><div className="sec-ttl">🏆 Top 10 Mais Vendidos</div></div>
        {top.length?(
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>#</th><th>Produto</th><th>Qtd</th><th>Receita</th></tr></thead>
              <tbody>{top.map(([k,v],i)=>(
                <tr key={k}><td>{i+1}</td><td>{k}</td><td className="fw">{v.qtd}</td><td className="tg fw">{R(v.receita)}</td></tr>
              ))}</tbody>
            </table>
          </div>
        ):<div className="empty">Sem dados no período.</div>}
      </div>

      {/* faturamento por dia */}
      <div className="sec mb4">
        <div className="sec-hdr"><div className="sec-ttl">📅 Faturamento por Dia</div></div>
        {dates.length?(
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Data</th><th style={{color:'#16a34a'}}>Dinheiro</th><th style={{color:'#2563eb'}}>Maquininha</th><th>Total</th></tr></thead>
              <tbody>{dates.map(d=>{
                const t=period.filter(s=>s.date===d).reduce((a,s)=>a+s.total,0);
                const m=db.closings.find(c=>c.date===d)?.maquina||0;
                return <tr key={d}><td>{fmtDateShort(d)}</td><td className="tg fw">{R(t-m)}</td><td className="tb fw">{R(m)}</td><td className="fw">{R(t)}</td></tr>;
              })}</tbody>
            </table>
          </div>
        ):<div className="empty">Sem dados no período.</div>}
      </div>

      {/* resumo por mês */}
      <div className="mth-hdr">
        <span>📅 Resumo por Mês — histórico completo</span>
        <button className="btn btn-o btn-sm" style={{background:'transparent',color:'#fff',borderColor:'rgba(255,255,255,.4)',fontSize:12}}>⬇️ Exportar</button>
      </div>
      <div className="sec">
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Mês</th><th>Total</th><th style={{color:'#7c3aed'}}>Renata</th><th style={{color:'#f97316'}}>Shay (bruto)</th></tr></thead>
            <tbody>{Object.entries(months).sort().map(([ym,v])=>(
              <tr key={ym}><td><b>{ym.slice(5,7)}/{ym.slice(0,4)}</b></td><td className="fw">{R(v.total)}</td><td>{R(v.renata)}</td><td>{R(v.shay)}</td></tr>
            ))}{!Object.keys(months).length&&<tr><td colSpan="4" style={{textAlign:'center',padding:30,color:'#9ca3af'}}>Sem dados</td></tr>}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Conferencia({tick}) {
  const [xlsData, setXlsData] = useState(() => getStone());
  const [fileName, setFileName] = useState('Stone - abril 2026');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const totalSys = db.sales.reduce((a,s)=>a+s.total,0);
  const totalXls = Object.values(xlsData).reduce((a,v)=>a+v,0);
  const totalDecl = db.closings.reduce((a,c)=>a+c.maquina,0);
  const dates = [...new Set([
    ...db.sales.map(s=>s.date),
    ...db.closings.map(c=>c.date),
    ...Object.keys(xlsData)
  ])].sort();

  function parseDate(raw) {
    if(!raw) return null;
    const s = String(raw).trim();
    const a = s.replace(/-/g,'/').split('/');
    if(a.length === 3) {
      const p1=a[0].trim(), p2=a[1].trim(), p3=a[2].trim();
      if(p3.length === 4) return p3+'-'+p2.padStart(2,'0')+'-'+p1.padStart(2,'0');
      if(p1.length === 4) return p1+'-'+p2.padStart(2,'0')+'-'+p3.padStart(2,'0');
    }
    const num = parseInt(s);
    if(!isNaN(num) && num > 40000 && num < 60000) {
      const dt = new Date(Math.round((num - 25569)*86400*1000));
      return dt.toISOString().slice(0,10);
    }
    return null;
  }

  function parseValor(raw) {
    if(raw===undefined||raw===null||raw==='') return 0;
    let s = String(raw).replace('R$','').replace('$','').trim();
    const parts = s.split(',');
    if(parts.length === 2) {
      const intPart = parts[0].split('').filter(c=>c>='0'&&c<='9').join('');
      const decPart = parts[1].split('').filter(c=>c>='0'&&c<='9').join('');
      s = intPart + '.' + decPart;
    } else {
      s = s.split('').filter(c=>(c>='0'&&c<='9')||c==='.').join('');
    }
    return parseFloat(s)||0;
  }

  async function handleFile(e) {
    const file = e.target.files[0];
    if(!file) return;
    setLoading(true); setErro(''); setXlsData({}); setFileName(file.name);

    function processXLSX(XLSX, buf) {
      const wb = XLSX.read(buf, {type:'array', cellDates:false});
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, {header:1, raw:true});
      if(rows.length < 2) { setErro('Arquivo vazio ou sem dados.'); setLoading(false); return; }
      const header = rows[0].map(h=>String(h||'').toUpperCase().trim());
      let colData = header.findIndex(h=>h.includes('DATA')||h.includes('DATE'));
      let colValor = header.findIndex(h=>
        h.includes('TOTAL')||h.includes('VALOR')||h.includes('VENDIDO')||
        h.includes('AMOUNT')||h.includes('BRUTO')||h.includes('LIQUIDO')
      );
      if(colData<0) colData=0;
      if(colValor<0) colValor=1;
      const result = {};
      for(let i=1;i<rows.length;i++){
        const row = rows[i];
        if(!row || row.length===0) continue;
        const dateStr = parseDate(row[colData]);
        const valor = parseValor(row[colValor]);
        if(!dateStr) continue;
        result[dateStr] = (result[dateStr]||0) + valor;
      }
      if(Object.keys(result).length===0){
        setErro('Nao foi possivel ler datas/valores. Verifique se o arquivo tem colunas DATA e TOTAL VENDIDO.');
      } else {
        setXlsData(result);
        saveStone(result); setLS("stoneName", file.name);
      }
      setLoading(false);
    }

    if(file.name.toLowerCase().endsWith('.csv')) {
      try {
        const text = await file.text();
        const lines = text.split('\n').map(l=>l.replace('\r','')).filter(l=>l.trim());
        if(lines.length < 2) { setErro('CSV vazio.'); setLoading(false); return; }
        const sep = lines[0].indexOf(';') >= 0 ? ';' : ',';
        const header = lines[0].split(sep).map(h=>h.split('').filter(c=>c!=='"').join('').toUpperCase().trim());
        let colData = header.findIndex(h=>h.includes('DATA')||h.includes('DATE'));
        let colValor = header.findIndex(h=>
          h.includes('TOTAL')||h.includes('VALOR')||h.includes('VENDIDO')||
          h.includes('AMOUNT')||h.includes('BRUTO')||h.includes('LIQUIDO')
        );
        if(colData<0) colData=0;
        if(colValor<0) colValor=1;
        const result = {};
        for(let i=1;i<lines.length;i++){
          const row = lines[i].split(sep).map(c=>c.split('').filter(x=>x!=='"').join('').trim());
          const dateStr = parseDate(row[colData]);
          const valor = parseValor(row[colValor]);
          if(!dateStr) continue;
          result[dateStr] = (result[dateStr]||0) + valor;
        }
        if(Object.keys(result).length===0){
          setErro('Nao foi possivel ler datas/valores do CSV.');
        } else {
          setXlsData(result);
          saveStone(result); setLS("stoneName", file.name);
        }
        setLoading(false);
      } catch(err) { setErro('Erro ao ler CSV: '+err.message); setLoading(false); }
      return;
    }

    try {
      const buf = await file.arrayBuffer();
      if(window.XLSX) {
        processXLSX(window.XLSX, new Uint8Array(buf));
      } else {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
        script.onload = () => processXLSX(window.XLSX, new Uint8Array(buf));
        script.onerror = () => { setErro('Nao foi possivel carregar a biblioteca XLS. Tente CSV.'); setLoading(false); };
        document.head.appendChild(script);
      }
    } catch(err) { setErro('Erro ao ler arquivo: '+err.message); setLoading(false); }
  }

  function limpar() {
    setXlsData({}); setFileName(''); setErro('');
    saveStone(preloadStone); setLS("stoneName", "");
  }

  return (
    <div>
      <div className="pg-hdr"><div className="pg-title">☑️ Conferência Maquininha</div></div>
      <p style={{fontSize:14,color:'#6b7280',marginBottom:16}}>Faça upload do relatório da maquininha e o sistema compara automaticamente com as vendas registradas por dia.</p>

      <div className="card mb4">
        <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Upload do relatório da maquininha (.xlsx, .xls, .csv)</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
          <label style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'9px 12px',border:'1.5px solid #d1d5db',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',background:'#fff',color:'#374151'}}>
            📂 Escolher Arquivo
            <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} style={{display:'none'}}/>
          </label>
          <button className="btn btn-o btn-sm" style={{justifyContent:'center'}} onClick={limpar}>✕ Limpar</button>
        </div>
        {loading && <div style={{fontSize:13,color:'#2563eb',marginBottom:6}}>⏳ Lendo arquivo...</div>}
        {fileName && !loading && !erro && (
          <div style={{fontSize:13,color:'#16a34a',marginBottom:6}}>
            ✅ {fileName} — {Object.keys(xlsData).length} dias carregados
            <span style={{marginLeft:8,fontSize:12,color:'#6b7280'}}>💾 salvo automaticamente</span>
          </div>
        )}
        {erro && <div style={{fontSize:13,color:'#dc2626',marginBottom:6}}>⚠️ {erro}</div>}
        <div style={{fontSize:12,color:'#6b7280'}}>O arquivo precisa ter colunas <b>DATA</b> e <b>TOTAL VENDIDO</b> (ou similar).</div>
      </div>

      <div className="sg mb4">
        <div className="sc c-navy"><div className="sc-lbl">💵 Total Vendas (Sistema)</div><div className="sc-val">{R(totalSys)}</div></div>
        <div className="sc c-blue"><div className="sc-lbl">💳 Maquininha (XLS)</div><div className="sc-val">{R(totalXls)}</div></div>
        <div className="sc c-green"><div className="sc-lbl">💵 Dinheiro Esperado</div><div className="sc-val">{R(totalSys-totalXls)}</div></div>
        <div className="sc c-purple"><div className="sc-lbl">🔒 Declarado Fechamento</div><div className="sc-val">{R(totalDecl)}</div></div>
      </div>

      <div className="sec">
        <div className="sec-hdr"><div className="sec-ttl">📅 Conferência por Dia — {dates.length} dias</div></div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th style={{color:'#2563eb'}}>Declarado Fechamento</th>
                <th>Maquininha (XLS)</th>
                <th style={{color:'#16a34a'}}>Dinheiro Esperado</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>{dates.length?dates.map(d=>{
              const t=db.sales.filter(s=>s.date===d).reduce((a,s)=>a+s.total,0);
              const c=db.closings.find(x=>x.date===d);
              const xls=xlsData[d]||0;
              const din=t-(c?.maquina||0);
              const diff = xls ? (c?.maquina||0) - xls : 0;
              const diverge = xls && Math.abs(diff) > 0.01;
              return <tr key={d} style={diverge?{background:'#fefce8'}:(!c?{background:'#f9fafb'}:{})}>
                <td>{fmtDateShort(d)}</td>
                <td className="tb fw">{c?R(c.maquina):<i style={{color:'#9ca3af'}}>sem fechamento</i>}</td>
                <td className={diverge?'tr fw':'fw'}>{xls?R(xls):<span style={{color:'#9ca3af'}}>—</span>}</td>
                <td className={"fw "+(din<0?'tr':'tg')}>{R(din)}</td>
                <td>{!xls
                  ? <span style={{fontSize:13,color:'#9ca3af'}}>—</span>
                  : diverge
                    ? <span style={{background:'#ef4444',color:'#fff',padding:'5px 10px',borderRadius:8,fontSize:12,fontWeight:700,whiteSpace:'nowrap'}}>⚠ DIVERGE {R(diff)}</span>
                    : <span style={{background:'#16a34a',color:'#fff',padding:'5px 10px',borderRadius:8,fontSize:12,fontWeight:700}}>✓ OK</span>
                }</td>
              </tr>;
            }):<tr><td colSpan="5" style={{textAlign:'center',padding:40,color:'#9ca3af'}}>Nenhum dado.</td></tr>}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
function Produtos({refresh, tick}) {
  const [products,setProducts]=useState(db.products);
  function persist(arr){db.products=arr; setProducts([...arr]); refresh();}
  function add(){
    const nome=prompt('Nome do produto'); if(!nome)return;
    const preco=Number(prompt('Preço')?.replace(',','.'));
    const categoria=prompt('Categoria: Serviço, Bar ou Comida')||'Bar';
    const responsavel=prompt('Responsável: Renata ou Shay')||'Renata';
    persist([...products,{id:uid(),nome,categoria,responsavel,preco,ativo:true}]);
  }
  function edit(id){
    const p=products.find(x=>x.id===id);
    const nome=prompt('Nome',p.nome)||p.nome;
    const preco=Number((prompt('Preço',String(p.preco))||String(p.preco)).replace(',','.'));
    persist(products.map(x=>x.id===id?{...x,nome,preco}:x));
  }
  const CC={Serviço:'#1e3a5f',Bar:'#2563eb',Comida:'#16a34a'};

  return (
    <div>
      <div className="pg-hdr">
        <div className="pg-title">🍽️ Cardápio / Produtos</div>
        <button className="btn btn-s btn-sm" onClick={add}>+ Novo Produto</button>
      </div>
      {['Serviço','Bar','Comida'].map(cat=>(
        <div key={cat} className="sec mb4">
          <div style={{background:CC[cat],color:'#fff',padding:'13px 16px',display:'flex',alignItems:'center',gap:8,fontSize:15,fontWeight:700}}>
            🏷️ {cat}
          </div>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Produto</th><th>Responsável</th><th>Preço</th><th>Ações</th></tr></thead>
              <tbody>{products.filter(p=>p.categoria===cat&&p.ativo).map(p=>(
                <tr key={p.id}>
                  <td>{p.nome}</td><td>{p.responsavel}</td><td className="fw">{R(p.preco)}</td>
                  <td>
                    <div className="act-btns">
                      <button className="btn btn-op btn-ico" onClick={()=>edit(p.id)}
                        title="Editar" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button className="btn btn-do btn-ico" onClick={()=>persist(products.map(x=>x.id===p.id?{...x,ativo:false}:x))}
                        title="Desativar" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      ))}
      <div className="card">
        <div style={{fontSize:14,fontWeight:600,color:'#9ca3af',marginBottom:12}}>Produtos Inativos</div>
        {products.filter(p=>!p.ativo).length?products.filter(p=>!p.ativo).map(p=>(
          <div key={p.id} className="inativo-row">
            <span style={{textDecoration:'line-through',color:'#9ca3af',flex:1}}>{p.nome}</span>
            <span style={{color:'#6b7280'}}>{p.responsavel}</span>
            <span>{R(p.preco)}</span>
            <button className="btn btn-og btn-sm" onClick={()=>persist(products.map(x=>x.id===p.id?{...x,ativo:true}:x))}>↺ Reativar</button>
          </div>
        )):<div style={{fontSize:14,color:'#9ca3af'}}>Nenhum produto inativo.</div>}
      </div>
    </div>
  );
}

// store de contagens mensais em memória
 // { 'YYYY-MM': { productId: qtd } }

function EstoqueFinal({refresh, tick}) {
  const hoje = new Date();
  const mesAtual = hoje.toISOString().slice(0,7);
  const [mes, setMes] = useState(mesAtual);
  const [contagem, setContagem] = useState({});
  const [saved, setSaved] = useState(false);

  const products = db.products.filter(p=>p.ativo);

  // calc estoque do sistema para o mês
  function calcSistema(id) {
    const mesInicio = mes + '-01';
    const mesFim = mes + '-31';
    const ent = db.moves.filter(m=>m.productId===id&&m.type==='entrada'&&m.date>=mesInicio&&m.date<=mesFim).reduce((a,m)=>a+m.qtd,0);
    const bai = db.moves.filter(m=>m.productId===id&&m.type==='baixa'&&m.date>=mesInicio&&m.date<=mesFim).reduce((a,m)=>a+m.qtd,0);
    const sai = db.sales.filter(s=>s.productId===id&&s.date>=mesInicio&&s.date<=mesFim).reduce((a,s)=>a+s.qtd,0);
    // estoque acumulado total (não só do mês)
    const entTotal = db.moves.filter(m=>m.productId===id&&m.type==='entrada').reduce((a,m)=>a+m.qtd,0);
    const baiTotal = db.moves.filter(m=>m.productId===id&&m.type==='baixa').reduce((a,m)=>a+m.qtd,0);
    const saiTotal = db.sales.filter(s=>s.productId===id).reduce((a,s)=>a+s.qtd,0);
    return entTotal - saiTotal - baiTotal;
  }

  function setQtd(id, val) {
    setContagem(prev => ({...prev, [id]: val === '' ? '' : Number(val)}));
    setSaved(false);
  }

  function salvar() {
    const ct = getContagens(); ct[mes] = {...contagem}; saveContagens(ct);
    setSaved(true);
    setTimeout(()=>setSaved(false), 3000);
  }

  function carregarMes(m) {
    setMes(m);
    setContagem(contagensStore[m] || {});
    setSaved(false);
  }

  const mesesDisponiveis = [...new Set([
    ...Object.keys(contagensStore),
    mesAtual
  ])].sort().reverse();

  // calcular resumo de divergências
  const divergencias = products.map(p => {
    const sistema = calcSistema(p.id);
    const contado = contagem[p.id] !== undefined && contagem[p.id] !== '' ? Number(contagem[p.id]) : null;
    const diff = contado !== null ? contado - sistema : null;
    const valor = diff !== null ? diff * p.preco : null;
    return { p, sistema, contado, diff, valor };
  }).filter(x => x.diff !== null && x.diff !== 0);

  const totalDesfalque = divergencias.filter(x=>x.valor<0).reduce((a,x)=>a+x.valor,0);
  const totalSobra = divergencias.filter(x=>x.valor>0).reduce((a,x)=>a+x.valor,0);
  const totalLancado = products.filter(p=>contagem[p.id]!==undefined&&contagem[p.id]!=='').length;

  const R = (n) => Number(n).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

  return (
    <div>
      <div className="pg-hdr">
        <div className="pg-title">🔍 Estoque Final do Mês</div>
      </div>
      <p style={{fontSize:14,color:'#6b7280',marginBottom:16}}>
        Lance a contagem física do estoque no último dia do mês. O sistema compara com o estoque calculado e aponta desfalques.
      </p>

      {/* seletor de mês */}
      <div className="card mb4" style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
        <div style={{fontSize:14,fontWeight:700}}>Mês de referência:</div>
        <input type="month" value={mes} onChange={e=>carregarMes(e.target.value)}
          style={{padding:'9px 12px',border:'1.5px solid #d1d5db',borderRadius:8,fontSize:14,background:'#fff'}}/>
        <button className="btn btn-s btn-sm" onClick={salvar}>💾 Salvar Contagem</button>
        {saved && <span style={{color:'#16a34a',fontWeight:600,fontSize:13}}>✅ Salvo!</span>}
      </div>

      {/* cards resumo */}
      {divergencias.length > 0 && (
        <div className="sg mb4">
          <div className="sc" style={{background:'#dc2626'}}>
            <div className="sc-lbl">🔻 Desfalque Total</div>
            <div className="sc-val">{R(totalDesfalque)}</div>
            <div className="sc-sub">{divergencias.filter(x=>x.diff<0).length} produto(s)</div>
          </div>
          <div className="sc" style={{background:'#16a34a'}}>
            <div className="sc-lbl">🔺 Sobra Total</div>
            <div className="sc-val">{R(totalSobra)}</div>
            <div className="sc-sub">{divergencias.filter(x=>x.diff>0).length} produto(s)</div>
          </div>
          <div className="sc c-navy">
            <div className="sc-lbl">📦 Produtos Contados</div>
            <div className="sc-val">{totalLancado}</div>
            <div className="sc-sub">de {products.length}</div>
          </div>
          <div className="sc" style={{background:'#f97316'}}>
            <div className="sc-lbl">⚠️ Com Divergência</div>
            <div className="sc-val">{divergencias.length}</div>
            <div className="sc-sub">produto(s)</div>
          </div>
        </div>
      )}

      {/* tabela de lançamento */}
      {['Serviço','Bar','Comida'].map(cat => (
        <div key={cat} className="sec mb4">
          <div style={{background:cat==='Serviço'?'#1e3a5f':cat==='Bar'?'#2563eb':'#16a34a',color:'#fff',padding:'12px 16px',fontSize:15,fontWeight:700}}>
            🏷️ {cat}
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th style={{textAlign:'center'}}>Estoque Sistema</th>
                  <th style={{textAlign:'center'}}>Contagem Física</th>
                  <th style={{textAlign:'center'}}>Diferença</th>
                  <th style={{textAlign:'right'}}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {products.filter(p=>p.categoria===cat).map(p => {
                  const sistema = calcSistema(p.id);
                  const contado = contagem[p.id] !== undefined && contagem[p.id] !== '' ? Number(contagem[p.id]) : null;
                  const diff = contado !== null ? contado - sistema : null;
                  const valor = diff !== null ? diff * p.preco : null;
                  const rowBg = diff === null ? {} : diff < 0 ? {background:'#fef2f2'} : diff > 0 ? {background:'#f0fdf4'} : {background:'#f0fdf4'};
                  return (
                    <tr key={p.id} style={rowBg}>
                      <td style={{fontSize:13}}>{p.nome}</td>
                      <td style={{textAlign:'center',fontWeight:700,color:'#2563eb'}}>{sistema}</td>
                      <td style={{textAlign:'center'}}>
                        <input
                          type="number"
                          min="0"
                          placeholder="—"
                          value={contagem[p.id] !== undefined ? contagem[p.id] : ''}
                          onChange={e=>setQtd(p.id, e.target.value)}
                          style={{width:70,padding:'6px 8px',border:'1.5px solid #d1d5db',borderRadius:8,textAlign:'center',fontSize:14,background:'#fff'}}
                        />
                      </td>
                      <td style={{textAlign:'center',fontWeight:700,
                        color: diff === null ? '#9ca3af' : diff < 0 ? '#dc2626' : diff > 0 ? '#16a34a' : '#16a34a'}}>
                        {diff === null ? '—' : (diff > 0 ? '+' : '') + diff}
                      </td>
                      <td style={{textAlign:'right',fontWeight:700,
                        color: valor === null ? '#9ca3af' : valor < 0 ? '#dc2626' : '#16a34a'}}>
                        {valor === null ? '—' : (valor > 0 ? '+' : '') + R(valor)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* resumo de divergências */}
      {divergencias.length > 0 && (
        <div className="sec mb4">
          <div className="sec-hdr"><div className="sec-ttl">⚠️ Resumo das Divergências</div></div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th style={{textAlign:'center'}}>Sistema</th>
                  <th style={{textAlign:'center'}}>Contado</th>
                  <th style={{textAlign:'center'}}>Diff</th>
                  <th style={{textAlign:'right'}}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {divergencias.sort((a,b)=>a.valor-b.valor).map(({p,sistema,contado,diff,valor})=>(
                  <tr key={p.id} style={{background: diff < 0 ? '#fef2f2' : '#f0fdf4'}}>
                    <td style={{fontSize:13,fontWeight:600}}>{p.nome}</td>
                    <td style={{textAlign:'center'}}>{sistema}</td>
                    <td style={{textAlign:'center'}}>{contado}</td>
                    <td style={{textAlign:'center',fontWeight:700,color:diff<0?'#dc2626':'#16a34a'}}>{diff>0?'+':''}{diff}</td>
                    <td style={{textAlign:'right',fontWeight:700,color:valor<0?'#dc2626':'#16a34a'}}>{valor>0?'+':''}{R(valor)}</td>
                  </tr>
                ))}
                <tr style={{borderTop:'2px solid #e5e7eb',background:'#f9fafb'}}>
                  <td colSpan="4" style={{fontWeight:700,fontSize:14}}>Total Desfalque</td>
                  <td style={{textAlign:'right',fontWeight:800,fontSize:16,color:'#dc2626'}}>{R(totalDesfalque)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
