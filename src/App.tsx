/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useState, useEffect, ReactNode } from "react";
import { 
  Settings, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  Phone, 
  Mail, 
  MapPin,
  ArrowUpRight,
  Factory,
  Layers,
  CheckCircle2
} from "lucide-react";

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const imageReveal = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
  visible: { 
    clipPath: "inset(0% 0% 0% 0%)", 
    opacity: 1,
    transition: { duration: 1.2, ease: [0.77, 0, 0.175, 1] }
  }
};

// --- Reusable Reveal Component ---
interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  key?: number | string;
}

const Reveal = ({ children, className = "", delay = 0 }: RevealProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] } 
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? "bg-white/90 backdrop-blur-xl py-4 shadow-sm border-b border-slate-100" : "bg-transparent py-6"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-10 h-10 bg-slate-900 flex items-center justify-center rounded-sm">
            <Settings className="text-white w-6 h-6 animate-spin-slow" />
          </div>
          <span className="font-sans font-bold text-xl tracking-tighter text-slate-900 uppercase">
            精工机械 <span className="text-slate-500 font-light">Precision</span>
          </span>
        </motion.div>
        
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
          {["首页", "产品中心", "解决方案", "关于我们"].map((item) => (
            <motion.a 
              key={item}
              href="#" 
              whileHover={{ y: -2 }}
              className="hover:text-slate-900 transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full" />
            </motion.a>
          ))}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-sm text-xs uppercase tracking-widest font-bold shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 transition-all"
          >
            联系我们
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Industry 4.0 Leader
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-sans font-bold text-slate-900 leading-[0.95] tracking-tighter mb-8">
            以精准定义 <br />
            <span className="text-slate-300 italic font-serif">工业之美</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-lg text-slate-500 mb-12 max-w-lg leading-relaxed font-medium">
            我们专注于高精度数控机床与工业锯条的研发与制造。为您的生产线提供卓越的效率、无与伦比的精度以及经久耐用的可靠性。
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-5">
            <motion.button 
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-slate-900 text-white font-black rounded-sm flex items-center gap-3 group transition-all shadow-xl shadow-slate-900/20"
            >
              浏览产品目录 <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button 
              whileHover={{ backgroundColor: "#fff", borderColor: "#000" }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 border border-slate-300 text-slate-900 font-black rounded-sm transition-all"
            >
              获取技术支持
            </motion.button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          style={{ y }}
          initial="hidden"
          animate="visible"
          variants={imageReveal}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] bg-slate-200">
            <img 
              src="https://picsum.photos/seed/machinery/1200/1500" 
              alt="Industrial Machinery" 
              className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 hover:scale-105 transition-all duration-1000 ease-out"
              referrerPolicy="no-referrer"
            />
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute -bottom-10 -left-10 bg-white p-10 shadow-2xl rounded-sm border border-slate-100 hidden xl:block"
          >
            <div className="flex items-center gap-6">
              <div className="text-6xl font-black text-slate-900 tracking-tighter">25<span className="text-blue-600">+</span></div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-tight">
                Years of <br /> Excellence
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.05] pointer-events-none">
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    { icon: Cpu, title: "智能数控", desc: "搭载最新一代AI控制系统，实现微米级加工精度。" },
    { icon: Zap, title: "高效产出", desc: "优化切削路径与转速，生产效率提升 40% 以上。" },
    { icon: ShieldCheck, title: "军工级品质", desc: "核心部件均采用高强度合金，确保 24/7 稳定运行。" },
  ];

  return (
    <section className="py-32 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-16"
        >
          {features.map((f, i) => (
            <motion.div 
              key={i}
              variants={fadeInUp}
              className="group cursor-default"
            >
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.1 }}
                className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center mb-8 group-hover:bg-slate-900 transition-all duration-500 shadow-sm"
              >
                <f.icon className="w-8 h-8 text-slate-900 group-hover:text-white transition-colors" />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

interface ProductCardProps {
  p: {
    title: string;
    category: string;
    image: string;
    specs: string[];
  };
  i: number;
  key?: number | string;
}

const ProductCard = ({ p, i }: ProductCardProps) => (
  <motion.div 
    variants={fadeInUp}
    whileHover={{ y: -15 }}
    className="bg-white group rounded-sm overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500"
  >
    <div className="aspect-[4/3] overflow-hidden relative">
      <img 
        src={p.image} 
        alt={p.title} 
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
        referrerPolicy="no-referrer" 
      />
      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all duration-500" />
    </div>
    <div className="p-10">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{p.category}</span>
      <h4 className="text-2xl font-bold text-slate-900 mt-3 mb-6 tracking-tight">{p.title}</h4>
      <div className="space-y-3 mb-8">
        {p.specs.map((s: string, si: number) => (
          <div key={si} className="flex items-center gap-3 text-xs font-bold text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            {s}
          </div>
        ))}
      </div>
      <motion.button 
        whileHover={{ backgroundColor: "#0f172a", color: "#fff" }}
        whileTap={{ scale: 0.95 }}
        className="w-full py-4 border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-900 transition-all"
      >
        查看技术规格
      </motion.button>
    </div>
  </motion.div>
);

const Products = () => {
  const products = [
    {
      title: "数控加工中心",
      category: "CNC Machine Tools",
      image: "https://picsum.photos/seed/cnc/800/600",
      specs: ["五轴联动", "12000 RPM", "BT40 主轴"]
    },
    {
      title: "高强度带锯条",
      category: "Saw Blades",
      image: "https://picsum.photos/seed/saw/800/600",
      specs: ["双金属材质", "极长寿命", "切削平整"]
    },
    {
      title: "精密数控车床",
      category: "Lathe Machines",
      image: "https://picsum.photos/seed/lathe/800/600",
      specs: ["高刚性床身", "自动送料", "±0.002mm 精度"]
    }
  ];

  return (
    <section id="products" className="py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <Reveal>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-4">Core Products</h2>
            <h3 className="text-5xl font-bold text-slate-900 tracking-tighter">卓越设备，铸就非凡</h3>
          </Reveal>
          <Reveal delay={0.2}>
            <motion.a 
              href="#" 
              whileHover={{ x: 5 }}
              className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 group"
            >
              查看所有产品 <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            </motion.a>
          </Reveal>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-10"
        >
          {products.map((p, i) => (
            <ProductCard key={i} p={p} i={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Stats = () => (
  <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-16 text-center relative z-10">
      {[
        { val: "500+", label: "全球客户" },
        { val: "120+", label: "专利技术" },
        { val: "24h", label: "售后响应" },
        { val: "99.9%", label: "合格率" },
      ].map((s, i) => (
        <Reveal key={i} delay={i * 0.1}>
          <div className="text-6xl font-black mb-4 tracking-tighter">{s.val}</div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">{s.label}</div>
        </Reveal>
      ))}
    </div>
    <div className="absolute inset-0 opacity-10 pointer-events-none">
      <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-white border-t border-slate-100 pt-32 pb-12">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-20 mb-24">
        <div className="col-span-2">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-slate-900 flex items-center justify-center rounded-sm">
              <Settings className="text-white w-6 h-6" />
            </div>
            <span className="font-sans font-bold text-2xl tracking-tighter text-slate-900 uppercase">
              精工机械
            </span>
          </div>
          <p className="text-slate-500 max-w-md leading-relaxed mb-10 font-medium">
            精工机械设备有限公司是行业领先的机械设备供应商，致力于为全球制造业提供高精度、高效率的加工设备与技术支持。
          </p>
          <div className="flex gap-5">
            {[Mail, Phone].map((Icon, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.1, backgroundColor: "#0f172a", color: "#fff" }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center cursor-pointer transition-all text-slate-600"
              >
                <Icon className="w-5 h-5" />
              </motion.div>
            ))}
          </div>
        </div>
        
        <div>
          <h5 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-10">快速链接</h5>
          <ul className="space-y-5 text-sm font-bold text-slate-400">
            {["产品中心", "技术支持", "成功案例", "新闻动态"].map(link => (
              <li key={link}><a href="#" className="hover:text-slate-900 transition-colors">{link}</a></li>
            ))}
          </ul>
        </div>

        <div id="contact">
          <h5 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-10">联系我们</h5>
          <ul className="space-y-6 text-sm font-bold text-slate-400">
            <li className="flex gap-4">
              <MapPin className="w-5 h-5 text-slate-300 shrink-0" />
              <span className="leading-relaxed">上海市松江区工业园精工路 88 号</span>
            </li>
            <li className="flex gap-4">
              <Phone className="w-5 h-5 text-slate-300 shrink-0" />
              <span>+86 (021) 5555-8888</span>
            </li>
            <li className="flex gap-4">
              <Mail className="w-5 h-5 text-slate-300 shrink-0" />
              <span>contact@jinggong-machinery.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-slate-100 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
        <div>© 2026 精工机械设备有限公司 版权所有</div>
        <div className="flex gap-10">
          <a href="#" className="hover:text-slate-900 transition-colors">隐私政策</a>
          <a href="#" className="hover:text-slate-900 transition-colors">服务条款</a>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-slate-900 selection:text-white antialiased">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Products />
        <Stats />
        
        {/* Solutions Section */}
        <section id="solutions" className="py-32 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="order-2 lg:order-1"
              >
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <motion.div variants={fadeInUp} className="aspect-[3/4] bg-slate-100 rounded-sm overflow-hidden shadow-lg">
                      <img src="https://picsum.photos/seed/ind1/600/800" alt="Industry" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                    </motion.div>
                    <motion.div variants={fadeInUp} className="aspect-square bg-slate-900 rounded-sm flex flex-col items-center justify-center p-8 text-center shadow-xl">
                      <Factory className="text-white w-12 h-12 mb-5" />
                      <div className="text-white font-black text-xs uppercase tracking-widest">智能工厂集成</div>
                    </motion.div>
                  </div>
                  <div className="space-y-6 pt-16">
                    <motion.div variants={fadeInUp} className="aspect-square bg-slate-200 rounded-sm flex flex-col items-center justify-center p-8 text-center shadow-lg">
                      <Layers className="text-slate-900 w-12 h-12 mb-5" />
                      <div className="text-slate-900 font-black text-xs uppercase tracking-widest">定制化生产线</div>
                    </motion.div>
                    <motion.div variants={fadeInUp} className="aspect-[3/4] bg-slate-100 rounded-sm overflow-hidden shadow-lg">
                      <img src="https://picsum.photos/seed/ind2/600/800" alt="Industry" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              <div className="order-1 lg:order-2">
                <Reveal>
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-6">Solutions</h2>
                  <h3 className="text-5xl font-bold text-slate-900 mb-10 leading-[1.1] tracking-tighter">
                    不仅是设备，更是您的 <br /> <span className="text-slate-300 italic font-serif">增长引擎</span>
                  </h3>
                </Reveal>
                <Reveal delay={0.2}>
                  <p className="text-lg text-slate-500 mb-12 leading-relaxed font-medium">
                    我们深入了解您的生产痛点，提供从设备选型、工艺优化到售后维护的全生命周期解决方案。无论是航空航天、汽车制造还是精密模具，我们都能助您突破技术瓶颈。
                  </p>
                </Reveal>
                
                <motion.ul 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="space-y-8 mb-12"
                >
                  {[
                    { title: "工艺咨询", desc: "资深工程师团队为您优化切削参数与工艺流程。" },
                    { title: "自动化升级", desc: "提供机械臂集成与自动上下料系统改造。" },
                    { title: "远程诊断", desc: "基于云端的数据监控，实现故障预警与快速修复。" },
                  ].map((item, i) => (
                    <motion.li key={i} variants={fadeInUp} className="flex gap-6 group">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center text-xs font-black shrink-0 mt-1 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                        0{i + 1}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">{item.title}</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
                
                <Reveal delay={0.4}>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 bg-slate-900 text-white font-black rounded-sm uppercase tracking-widest text-xs shadow-2xl shadow-slate-900/20 transition-all"
                  >
                    预约专家咨询
                  </motion.button>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 bg-slate-50 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <Reveal>
              <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 tracking-tighter">准备好提升您的生产力了吗？</h2>
              <p className="text-xl text-slate-500 mb-14 leading-relaxed font-medium">
                立即联系我们的技术顾问，获取为您量身定制的机械设备方案与报价。
              </p>
            </Reveal>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Reveal delay={0.2}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="flex items-center gap-4 px-8 py-5 bg-white border border-slate-100 rounded-sm shadow-sm"
                >
                  <Phone className="w-6 h-6 text-blue-500" />
                  <span className="font-black text-xl text-slate-900 tracking-tight">+86 (021) 5555-8888</span>
                </motion.div>
              </Reveal>
              <Reveal delay={0.3}>
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: "#1e293b" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-5 bg-slate-900 text-white font-black rounded-sm uppercase tracking-widest text-xs shadow-2xl shadow-slate-900/20 transition-all h-full"
                >
                  在线留言
                </motion.button>
              </Reveal>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-900/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </section>
      </main>
      <Footer />
    </div>
  );
}
