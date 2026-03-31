/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring, useMotionTemplate, animate } from "motion/react";
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
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

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

const PrecisionBackground = () => {
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30, mass: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${springX}px ${springY}px, rgba(15, 23, 42, 0.04), transparent 40%)`;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-slate-50">
      {/* Blueprint Grid */}
      <div 
        className="absolute inset-0 opacity-[0.15]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.2) 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }} 
      />
      
      {/* Mouse Spotlight */}
      <motion.div 
        className="absolute inset-0"
        style={{ background: spotlight }}
      />

      {/* Vertical Crosshair */}
      <motion.div 
        className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-900/20 to-transparent"
        style={{ x: springX, left: 0 }}
      />
      
      {/* Horizontal Crosshair */}
      <motion.div 
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-900/20 to-transparent"
        style={{ y: springY, top: 0 }}
      />

      {/* Center Reticle */}
      <motion.div 
        className="absolute w-6 h-6 border border-blue-900/30 rounded-full -ml-3 -mt-3 flex items-center justify-center"
        style={{ x: springX, y: springY, top: 0, left: 0 }}
      >
        <div className="w-1 h-1 bg-blue-900/50 rounded-full" />
      </motion.div>
    </div>
  );
};

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
          <span className="font-serif font-bold text-xl tracking-tighter text-slate-900 uppercase">
            武汉震球 <span className="text-slate-500 font-light">Zhenqiu</span>
          </span>
        </motion.div>
        
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
          {[
            { label: "首页", href: "#" },
            { label: "关于我们", href: "#about" }
          ].map((item) => (
            <motion.a 
              key={item.label}
              href={item.href} 
              onClick={(e) => {
                e.preventDefault();
                if (item.label === "首页" || item.href === "#") {
                  animate(window.scrollY, 0, {
                    duration: 1.2,
                    ease: [0.22, 1, 0.36, 1],
                    onUpdate: (latest) => window.scrollTo(0, latest)
                  });
                } else if (item.href.startsWith('#') && item.href.length > 1) {
                  const target = document.querySelector(item.href);
                  if (target) {
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY;
                    animate(window.scrollY, targetPosition - 100, {
                      duration: 1.2,
                      ease: [0.22, 1, 0.36, 1],
                      onUpdate: (latest) => window.scrollTo(0, latest)
                    });
                  }
                }
              }}
              whileHover={{ y: -2 }}
              className="hover:text-slate-900 transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full" />
            </motion.a>
          ))}
          <motion.button 
            onClick={() => {
              const target = document.getElementById('contact');
              if (target) {
                const targetPosition = target.getBoundingClientRect().top + window.scrollY;
                animate(window.scrollY, targetPosition - 100, {
                  duration: 1.2,
                  ease: [0.22, 1, 0.36, 1],
                  onUpdate: (latest) => window.scrollTo(0, latest)
                });
              }
            }}
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
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 text-slate-600 text-xs font-black uppercase tracking-[0.2em] mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            始于 2006 · 专注带锯床与锯条
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-serif font-bold text-slate-900 leading-[0.95] tracking-tighter mb-8">
            以专利技术 <br />
            <span className="text-slate-300 italic font-serif">重塑切割效率</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-lg text-slate-500 mb-12 max-w-lg leading-relaxed font-medium">
            武汉震球机械设备有限公司专业生产和销售各种系列带锯床及带锯条。拥有五项国家专利，致力于为您提供不断齿、高寿命、低成本的极致切割体验。
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-5">
            <motion.button 
              onClick={() => {
                const target = document.getElementById('contact');
                if (target) {
                  const targetPosition = target.getBoundingClientRect().top + window.scrollY;
                  animate(window.scrollY, targetPosition - 100, {
                    duration: 1.2,
                    ease: [0.22, 1, 0.36, 1],
                    onUpdate: (latest) => window.scrollTo(0, latest)
                  });
                }
              }}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-slate-900 text-white font-black rounded-sm flex items-center gap-3 group transition-all shadow-xl shadow-slate-900/20"
            >
              联系我们 <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button 
              onClick={() => {
                const target = document.getElementById('products');
                if (target) {
                  const targetPosition = target.getBoundingClientRect().top + window.scrollY;
                  animate(window.scrollY, targetPosition - 100, {
                    duration: 1.2,
                    ease: [0.22, 1, 0.36, 1],
                    onUpdate: (latest) => window.scrollTo(0, latest)
                  });
                }
              }}
              whileHover={{ backgroundColor: "#fff", borderColor: "#000" }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 border border-slate-300 text-slate-900 font-black rounded-sm transition-all cursor-pointer"
            >
              查看主营产品
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
              src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1200&auto=format&fit=crop" 
              alt="Saw blade running on a machine" 
              className="w-full h-full object-cover hover:scale-105 transition-all duration-1000 ease-out"
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
              <div className="text-6xl font-black text-slate-900 tracking-tighter">20<span className="text-blue-600">+</span></div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] leading-tight">
                Years of <br /> Experience
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    { icon: ShieldCheck, title: "五项国家专利", desc: "独家技术确保锯条不断齿、不断带，成倍延长锯条使用寿命，保障生产连续性。" },
    { icon: Zap, title: "极致切割效率", desc: "生产效率高达 130cm²/min (45#钢)，比传统设备高出一倍，大幅提升产能。" },
    { icon: Cpu, title: "超低耗用成本", desc: "专利技术的应用使锯条耗用成本大幅降低，每平方米截面积成本控制在 17 元以下。" },
  ];

  return (
    <section className="py-32 bg-white/60 backdrop-blur-2xl border-y border-slate-200/50">
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
    actions?: { label: string; href: string }[];
  };
  i: number;
  key?: number | string;
}

const ProductCard = ({ p, i }: ProductCardProps) => (
  <motion.div variants={fadeInUp}>
    <div className="bg-white group rounded-sm overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 cursor-pointer">
      <div className="aspect-[4/3] overflow-hidden relative">
        <img 
          src={p.image} 
          alt={p.title} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500" 
          referrerPolicy="no-referrer" 
        />
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all duration-500" />
      </div>
      <div className="p-10">
        <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">{p.category}</span>
        <h4 className="text-2xl font-bold text-slate-900 mt-3 mb-6 tracking-tight">{p.title}</h4>
        <div className="space-y-3 mb-8">
          {p.specs.map((s: string, si: number) => (
            <div key={si} className="flex items-center gap-3 text-xs font-bold text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              {s}
            </div>
          ))}
        </div>
        {p.actions ? (
          <div className="flex gap-2">
            {p.actions.map((action: any, idx: number) => (
              <motion.a 
                key={idx}
                href={action.href}
                target={action.href.startsWith('#') ? undefined : "_blank"}
                rel={action.href.startsWith('#') ? undefined : "noopener noreferrer"}
                onClick={(e) => {
                  if (action.href.startsWith('#')) {
                    e.preventDefault();
                    document.querySelector(action.href)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                whileHover={{ backgroundColor: "#0f172a", color: "#fff" }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-4 border border-slate-200 text-center text-xs font-black uppercase tracking-widest text-slate-900 transition-all block"
              >
                {action.label}
              </motion.a>
            ))}
          </div>
        ) : (
          <motion.button 
            whileHover={{ backgroundColor: "#0f172a", color: "#fff" }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-900 transition-all"
          >
            查看技术规格
          </motion.button>
        )}
      </div>
    </div>
  </motion.div>
);

const Products = () => {
  const products = [
    {
      title: "雁荡山震球卧式带锯床",
      category: "核心设备",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop",
      specs: ["高效稳定", "专利技术加持", "低耗材成本"],
      actions: [
        { label: "查看公司信息", href: "https://www.maigoo.com/brand/131473.html" },
        { label: "查看公司样本", href: "https://www.yangben001.com/new/open/open9938.html#&gid=1&pid=1" }
      ]
    },
    {
      title: "湖南泰嘉带锯条",
      category: "精密加工",
      image: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=800&auto=format&fit=crop",
      specs: ["灵活操作", "高精度切割", "适应多种材质"],
      actions: [
        { label: "查看相关信息", href: "https://www.bichamp.com/index.php?m=home&c=Lists&a=index&tid=15&typeid=13" }
      ]
    },
    {
      title: "全球优选带锯条",
      category: "进口耗材",
      image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=80&w=800&auto=format&fit=crop",
      specs: ["美国/日本进口", "德国/英国品质", "超长使用寿命"],
      actions: [
        { label: "更多详情请联系我们", href: "#cta" }
      ]
    }
  ];

  return (
    <section id="products" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <Reveal>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.5em] mb-4">Core Products</h2>
            <h3 className="text-5xl font-bold text-slate-900 tracking-tighter">卓越设备，铸就非凡</h3>
          </Reveal>
          <Reveal delay={0.2}>
            <motion.a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                animate(window.scrollY, 0, {
                  duration: 1.2,
                  ease: [0.22, 1, 0.36, 1],
                  onUpdate: (latest) => window.scrollTo(0, latest)
                });
              }}
              whileHover={{ x: 5 }}
              className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 group cursor-pointer"
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
        { val: "2006", label: "成立年份" },
        { val: "5", label: "国家专利" },
        { val: "130", label: "最高切割效率(cm²/min)" },
        { val: "17", label: "每平米耗用成本低于(元)" },
      ].map((s, i) => (
        <Reveal key={i} delay={i * 0.1}>
          <div className="text-6xl font-black mb-4 tracking-tighter">{s.val}</div>
          <div className="text-xs text-slate-400 font-black uppercase tracking-[0.3em]">{s.label}</div>
        </Reveal>
      ))}
    </div>
    <div className="absolute inset-0 opacity-10 pointer-events-none">
      <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
    </div>
  </section>
);

const Footer = () => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const contactInfo = [
    { Icon: Mail, text: "804651463@qq.com", label: "邮箱" },
    { Icon: Phone, text: "027-85823759", label: "电话" }
  ];

  return (
    <footer className="bg-white/90 backdrop-blur-xl border-t border-slate-200/50 pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-20 mb-24">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-10">
              <span className="font-serif font-bold text-2xl tracking-tighter text-slate-900 uppercase">
                武汉震球机械设备有限公司
              </span>
            </div>
            <p className="text-slate-500 max-w-md leading-relaxed mb-10 font-medium">
              专业生产和销售各种系列带锯床及带锯条，拥有五项国家专利，为您提供高效、低耗的切割解决方案。
            </p>
            <div className="flex gap-5">
              {contactInfo.map(({ Icon, text, label }, i) => (
                <div key={i} className="relative flex flex-col items-center">
                  <motion.div 
                    onClick={() => handleCopy(text, label)}
                    whileHover={{ scale: 1.1, backgroundColor: "#0f172a", color: "#fff" }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center cursor-pointer transition-all text-slate-600"
                    title={`点击复制${label}`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <AnimatePresence>
                    {copiedText === label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute -bottom-8 whitespace-nowrap text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-sm shadow-sm"
                      >
                        已复制!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-10">主营业务</h5>
            <ul className="space-y-5 text-sm font-bold text-slate-400">
              {["高精度机床", "五金工具", "化工产品", "带锯床及带锯条"].map(link => (
                <li key={link}>
                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      setCopiedText(link);
                      setTimeout(() => setCopiedText(null), 1000);
                    }}
                    whileHover={{ x: 5, color: "#0f172a" }}
                    whileTap={{ scale: 0.95 }}
                    className="relative flex items-center text-left hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    {link}
                    <AnimatePresence>
                      {copiedText === link && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0, rotate: -45 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0 }}
                          className="absolute -right-6 text-blue-500"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>

          <div id="contact">
            <h5 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-10">联系我们</h5>
            <ul className="space-y-6 text-sm font-bold text-slate-400">
              <li 
                className="flex gap-4 cursor-pointer group relative"
                onClick={() => handleCopy("武汉市江汉区天一小区甲栋207号", "地址文本")}
                title="点击复制地址"
              >
                <MapPin className="w-5 h-5 text-slate-300 shrink-0 group-hover:text-slate-900 transition-colors" />
                <span className="group-hover:text-slate-900 transition-colors flex items-center leading-relaxed">
                  武汉市江汉区天一小区甲栋207号
                  <AnimatePresence>
                    {copiedText === "地址文本" && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="ml-2 text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-sm whitespace-nowrap shadow-sm"
                      >
                        已复制!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </li>
              <li 
                className="flex gap-4 cursor-pointer group relative"
                onClick={() => handleCopy("027-85823759", "电话文本")}
                title="点击复制电话"
              >
                <Phone className="w-5 h-5 text-slate-300 shrink-0 group-hover:text-slate-900 transition-colors" />
                <span className="group-hover:text-slate-900 transition-colors flex items-center">
                  027-85823759 (传真同号)
                  <AnimatePresence>
                    {copiedText === "电话文本" && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="ml-2 text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-sm whitespace-nowrap shadow-sm"
                      >
                        已复制!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </li>
              <li 
                className="flex gap-4 cursor-pointer group relative"
                onClick={() => handleCopy("804651463@qq.com", "邮箱文本")}
                title="点击复制邮箱"
              >
                <Mail className="w-5 h-5 text-slate-300 shrink-0 group-hover:text-slate-900 transition-colors" />
                <span className="group-hover:text-slate-900 transition-colors flex items-center">
                  804651463@qq.com
                  <AnimatePresence>
                    {copiedText === "邮箱文本" && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="ml-2 text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-sm whitespace-nowrap shadow-sm"
                      >
                        已复制!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-100 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
          <div>© 2026 武汉震球机械设备有限公司 版权所有</div>
          <div className="flex gap-10">
            <motion.a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              whileHover={{ scale: 1.05, color: "#0f172a" }}
              whileTap={{ scale: 0.95 }}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              隐私政策
            </motion.a>
            <motion.a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              whileHover={{ scale: 1.05, color: "#0f172a" }}
              whileTap={{ scale: 0.95 }}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              服务条款
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const ShareholderChart = () => {
  const [hoveredSlice, setHoveredSlice] = useState<{ data: any, side: 'left' | 'right' } | null>(null);

  const data = [
    { name: "占万龙", value: 40, amount: "40.4万(元)", color: "url(#metal-slate)", legendColor: "#0f172a" },
    { name: "何邦伟", value: 40, amount: "40.4万(元)", tag: "法定代表人", color: "url(#metal-blue)", legendColor: "#3b82f6" },
    { name: "占美春", value: 20, amount: "20.2万(元)", color: "url(#metal-gray)", legendColor: "#94a3b8" },
  ];

  return (
    <>
      <div className="relative h-64 w-full mt-4 flex items-center justify-center">
        <AnimatePresence>
          {hoveredSlice && hoveredSlice.side === 'left' && (
            <motion.div
              initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md p-4 shadow-2xl border border-slate-100/50 rounded-lg z-20 w-44 pointer-events-none"
            >
              <div className="font-bold text-slate-900 flex flex-col gap-1 mb-2">
                <div className="flex items-center gap-2">
                  {hoveredSlice.data.name}
                  {hoveredSlice.data.tag && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-sm uppercase tracking-wider">{hoveredSlice.data.tag}</span>}
                </div>
              </div>
              <div className="text-xs text-slate-500 font-medium mb-1">持股比例: <span className="text-slate-900 font-bold">{hoveredSlice.data.value}%</span></div>
              <div className="text-xs text-slate-500 font-medium">认缴出资: <span className="text-slate-900 font-bold">{hoveredSlice.data.amount}</span></div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          animate={{ y: [-4, 4, -4] }} 
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="w-full h-full absolute inset-0 z-10"
        >
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <PieChart>
              <defs>
                <linearGradient id="metal-slate" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="20%" stopColor="#1e293b" />
                  <stop offset="50%" stopColor="#0f172a" />
                  <stop offset="80%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>
                <linearGradient id="metal-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="20%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#2563eb" />
                  <stop offset="80%" stopColor="#1d4ed8" />
                  <stop offset="100%" stopColor="#1e3a8a" />
                </linearGradient>
                <linearGradient id="metal-gray" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="20%" stopColor="#cbd5e1" />
                  <stop offset="50%" stopColor="#94a3b8" />
                  <stop offset="80%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={1}
                onMouseEnter={(entry) => {
                  let side: 'left' | 'right' = 'right';
                  const midAngle = entry.midAngle;
                  if (midAngle > 90 && midAngle < 270) {
                    side = 'left';
                  }
                  setHoveredSlice({ data: entry.payload, side });
                }}
                onMouseLeave={() => setHoveredSlice(null)}
                style={{ filter: 'drop-shadow(0px 15px 25px rgba(0,0,0,0.15))' }}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    style={{ 
                      outline: 'none', 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }} 
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <AnimatePresence>
          {hoveredSlice && hoveredSlice.side === 'right' && (
            <motion.div
              initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 20, filter: "blur(4px)" }}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md p-4 shadow-2xl border border-slate-100/50 rounded-lg z-20 w-44 pointer-events-none"
            >
              <div className="font-bold text-slate-900 flex flex-col gap-1 mb-2">
                <div className="flex items-center gap-2">
                  {hoveredSlice.data.name}
                  {hoveredSlice.data.tag && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-sm uppercase tracking-wider">{hoveredSlice.data.tag}</span>}
                </div>
              </div>
              <div className="text-xs text-slate-500 font-medium mb-1">持股比例: <span className="text-slate-900 font-bold">{hoveredSlice.data.value}%</span></div>
              <div className="text-xs text-slate-500 font-medium">认缴出资: <span className="text-slate-900 font-bold">{hoveredSlice.data.amount}</span></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-6 mt-6">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.legendColor }} />
            <div className="text-xs font-bold text-slate-700">{entry.name}</div>
            <div className="text-xs text-slate-400 font-medium">{entry.value}%</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default function App() {
  const [copiedCTA, setCopiedCTA] = useState<string | null>(null);

  const handleCopyCTA = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCTA(type);
    setTimeout(() => setCopiedCTA(null), 2000);
  };

  return (
    <div className="relative min-h-screen font-serif selection:bg-slate-900 selection:text-white antialiased">
      <PrecisionBackground />
      <div className="relative z-10">
        <Navbar />
        <main>
        <Hero />
        <Features />
        <Products />
        <Stats />
        
        {/* About Section */}
        <section id="about" className="py-32 bg-white/60 backdrop-blur-2xl border-y border-slate-200/50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <Reveal><h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tighter">关于武汉震球</h2></Reveal>
                <Reveal delay={0.1}>
                  <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                    武汉震球机械设备有限公司成立于2006年12月05日，法定代表人为何邦伟。我们不仅专业生产和销售各种系列带锯床及带锯条，并提供专业的焊接磨齿服务。
                    <br/><br/>
                    经营范围涵盖：机械电气设备销售、机械设备租赁、五金工具、化工产品销售（不含许可类）、技术开发与咨询等。我们以五项国家专利为核心竞争力，为客户提供全方位的机械设备解决方案。
                  </p>
                </Reveal>
                
                <Reveal delay={0.2}>
                  <div className="grid grid-cols-2 gap-8 mb-12">
                    <div>
                      <div className="text-3xl font-black text-slate-900 mb-2">101<span className="text-sm text-slate-500 font-medium ml-1">万元</span></div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">注册资本</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-slate-900 mb-2">2006<span className="text-sm text-slate-500 font-medium ml-1">年</span></div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">成立时间</div>
                    </div>
                  </div>
                </Reveal>
              </motion.div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-slate-900 translate-x-4 translate-y-4 rounded-sm" />
                <div className="relative bg-white border border-slate-200 p-10 rounded-sm shadow-xl">
                  <h3 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">公司架构与股东信息</h3>
                  <ShareholderChart />
                  <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400 font-medium text-center">
                    认缴日期: 2014年4月10日
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="py-40 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <Reveal>
              <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 tracking-tighter">准备好提升您的生产力了吗？</h2>
              <p className="text-xl text-slate-500 mb-14 leading-relaxed font-medium">
                立即联系我们的技术顾问，获取为您量身定制的带锯床与锯条方案及报价。
              </p>
            </Reveal>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Reveal delay={0.2}>
                <motion.div 
                  onClick={() => handleCopyCTA("027-85823759", "phone")}
                  whileHover={{ y: -5 }}
                  className="relative flex items-center gap-4 px-8 py-5 bg-white border border-slate-100 rounded-sm shadow-sm cursor-pointer"
                  title="点击复制电话"
                >
                  <Phone className="w-6 h-6 text-blue-500" />
                  <span className="font-black text-xl text-slate-900 tracking-tight">027-85823759</span>
                  <AnimatePresence>
                    {copiedCTA === "phone" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-sm shadow-sm"
                      >
                        已复制!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Reveal>
              <Reveal delay={0.3}>
                <motion.button 
                  onClick={() => handleCopyCTA("804651463@qq.com", "email")}
                  whileHover={{ scale: 1.05, backgroundColor: "#1e293b" }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-12 py-5 bg-slate-900 text-white font-black rounded-sm uppercase tracking-widest text-xs shadow-2xl shadow-slate-900/20 transition-all h-full cursor-pointer"
                  title="点击复制邮箱"
                >
                  发送邮件咨询
                  <AnimatePresence>
                    {copiedCTA === "email" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-sm shadow-sm"
                      >
                        已复制!
                      </motion.div>
                    )}
                  </AnimatePresence>
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
    </div>
  );
}
