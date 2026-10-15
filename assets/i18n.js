/* Nítido Studio: tradução in-place. Dicionário explícito, sem coleta de dados e sem tradutor remoto.
 * Nunca traduz conteúdo de cases conceituais nem detalhes de preço para evitar alegações incorretas.
 * Textos não traduzidos permanecem em português até revisão editorial.
 */
(function(){
  'use strict';
  const languages=['pt-BR','en','es','zh-CN','ja'];
  const translations={
    'en':{
      'Como funciona':'How it works','Trabalhos':'Our work','Pacotes':'Packages','Perguntas':'FAQs','Contato':'Contact',
      'Ver os pacotes':'Explore packages','Falar no WhatsApp':'Chat on WhatsApp',
      'Seu negócio já é bom.':'Your business is already good.','Falta ficar nítido':'Make it stand out','para quem procura.':'to people searching.',
      'Criação, administração e tráfego para sites de empresas.':'Web design, ongoing management and traffic for businesses.',
      'Três formas de existir sem ser encontrado':'Three ways to be online but invisible',
      'Só tem Instagram':'Only on Instagram',
      'Vamos deixar o seu negócio nítido.':"Let's make your business stand out.",
      'Projetos a partir de R$ 497.':'Brazilian plans from R$ 497.',
      'Base em Luís Eduardo Magalhães, Bahia. Atendimento remoto para todo o Brasil e a América Latina.':'Based in Brazil. Working with businesses worldwide.'
    },
    'es':{
      'Como funciona':'Cómo funciona','Trabalhos':'Proyectos','Pacotes':'Planes','Perguntas':'Preguntas frecuentes','Contato':'Contacto',
      'Ver os pacotes':'Ver los planes','Falar no WhatsApp':'Hablar por WhatsApp',
      'Seu negócio já é bom.':'Tu negocio ya es bueno.','Falta ficar nítido':'Haz que destaque','para quem procura.':'para quienes lo buscan.',
      'Criação, administração e tráfego para sites de empresas.':'Diseño web, mantenimiento y tráfico para empresas.',
      'Três formas de existir sem ser encontrado':'Tres formas de estar en línea sin ser encontrado',
      'Só tem Instagram':'Solo tiene Instagram',
      'Vamos deixar o seu negócio nítido.':'Hagamos que tu negocio destaque.',
      'Projetos a partir de R$ 497.':'Planes en Brasil desde R$ 497.',
      'Base em Luís Eduardo Magalhães, Bahia. Atendimento remoto para todo o Brasil e a América Latina.':'Con sede en Brasil. Trabajamos con empresas de todo el mundo.'
    },
    'zh-CN':{
      'Como funciona':'服务流程','Trabalhos':'作品案例','Pacotes':'服务套餐','Perguntas':'常见问题','Contato':'联系我们',
      'Ver os pacotes':'查看套餐','Falar no WhatsApp':'通过 WhatsApp 联系',
      'Seu negócio já é bom.':'您的业务已经很出色。','Falta ficar nítido':'让您的品牌','para quem procura.':'被更多客户看见。',
      'Criação, administração e tráfego para sites de empresas.':'为企业提供网站设计、维护与推广服务。',
      'Três formas de existir sem ser encontrado':'在线却难以被客户发现的三种情况',
      'Só tem Instagram':'只有 Instagram',
      'Vamos deixar o seu negócio nítido.':'让更多客户发现您的企业。',
      'Projetos a partir de R$ 497.':'巴西本地套餐低至 497 雷亚尔。',
      'Base em Luís Eduardo Magalhães, Bahia. Atendimento remoto para todo o Brasil e a América Latina.':'总部位于巴西，为全球企业提供远程服务。'
    },
    'ja':{
      'Como funciona':'サービスの流れ','Trabalhos':'制作実績','Pacotes':'料金プラン','Perguntas':'よくある質問','Contato':'お問い合わせ',
      'Ver os pacotes':'プランを見る','Falar no WhatsApp':'WhatsAppで相談',
      'Seu negócio já é bom.':'あなたのビジネスには価値があります。','Falta ficar nítido':'その魅力を','para quem procura.':'探している人に届けましょう。',
      'Criação, administração e tráfego para sites de empresas.':'企業向けWeb制作・運用・集客支援。',
      'Três formas de existir sem ser encontrado':'オンラインにいても見つけてもらえない３つの理由',
      'Só tem Instagram':'Instagramだけ',
      'Vamos deixar o seu negócio nítido.':'あなたのビジネスの魅力を伝えましょう。',
      'Projetos a partir de R$ 497.':'ブラジル国内向けプランは497レアルから。',
      'Base em Luís Eduardo Magalhães, Bahia. Atendimento remoto para todo o Brasil e a América Latina.':'ブラジルを拠点に世界中の企業をリモートで支援します。'
    }
  };
  const select=document.getElementById('site-language');if(!select)return;
  const baseline=new Map();
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  let node;
  while((node=walker.nextNode())){
    const parent=node.parentElement;
    if(!parent||parent.closest('script,style,svg,select,.palco'))continue;
    const original=node.nodeValue;
    const trimmed=original.trim();
    if(trimmed && Object.values(translations).some(dict=>Object.prototype.hasOwnProperty.call(dict,trimmed))){
      baseline.set(node,{original,trimmed});
    }
  }
  const title=document.title;
  const description=document.querySelector('meta[name="description"]');
  const baselineDescription=description&&description.content;
  const descriptions={
    en:'Nítido Studio designs modern websites for service businesses. Based in Brazil, serving clients worldwide. Request a project quote.',
    es:'Nítido Studio crea sitios web profesionales para empresas de servicios. Desde Brasil, atendemos clientes de todo el mundo.',
    'zh-CN':'Nítido Studio 为服务型企业设计专业网站，面向全球客户提供远程服务。',
    ja:'Nítido Studioはサービス業向けのプロフェッショナルなWebサイトを制作し、世界中の企業をサポートします。'
  };
  function apply(language){
    const lang=languages.includes(language)?language:'pt-BR';
    const dict=translations[lang]||{};
    baseline.forEach((record,textNode)=>{
      const replacement=dict[record.trimmed];
      textNode.nodeValue=replacement===undefined?record.original:record.original.replace(record.trimmed,replacement);
    });
    document.documentElement.lang=lang;
    document.title=lang==='pt-BR'?title:'Nítido Studio — Web Design';
    if(description)description.content=lang==='pt-BR'?baselineDescription:descriptions[lang];
    select.value=lang;
    try{localStorage.setItem('nitido-language',lang);}catch(e){}
    // Pending: localize all remaining prose/pricing before merging into production.
  }
  select.addEventListener('change',()=>apply(select.value));
  let saved='pt-BR';
  try{saved=localStorage.getItem('nitido-language')||saved;}catch(e){}
  const requested=new URLSearchParams(location.search).get('lang');
  apply(requested||saved);
})();
