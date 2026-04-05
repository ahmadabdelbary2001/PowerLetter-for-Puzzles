# 🧩 **PowerLetter for Puzzles**
> _نظام ألعاب ألغاز متعدد ومتكامل يدعم أكثر من 7 أنماط مختلفة للعب، مبني بهيكلية Monorepo متقدمة للعمل على الويب (Next.js) وسطح المكتب/الهاتف المحمول (Tauri)._

<div align="center">
  <img src="https://img.shields.io/badge/Language-English-blue?style=flat-square" alt="English">
  <a href="locales/README.en.md">English Version</a> |
  <img src="https://img.shields.io/badge/Language-Arabic-green?style=flat-square" alt="Arabic">
  <a href="#">النسخة العربية</a>
</div>

---

## 📖 **نظرة عامة**
> _يهدف هذا المشروع إلى تقديم منصة ألغاز متكاملة تدعم التنافسية. يتم تشغيل اللعبة عبر محرك ألعاب مخصص (Game Engine Factory) صُمم بعقلية قابلة للتوسع لإضافة عشرات الألعاب وتوحيد حالة اللعب بين المنصات المختلفة._

---

## 📋 **قائمة المحتويات** <a id="toc"></a>
1. [✨ المميزات الرئيسية](#features)
2. [💻 التقنيات المستخدمة](#tech-stack)
3. [🚀 ابدأ الآن](#getting-started)
4. [🎮 محرك الألعاب (Game Engine Factory)](#game-engine)
5. [📁 هيكلية المشروع (FSD)](#project-structure)
6. [📜 التراخيص](#license)

---

## ✨ **المميزات الرئيسية** <a id="features"></a>
- **🧩 7+ أنماط ألعاب**: مجموعة متنوعة من الألغاز التي تدار بواسطة محرك ألعاب مركزي تفاعلي.
- **🌍 دعم لغوي ديناميكي**: واجهات متوافقة بالكامل مع اللغتين العربية والإنجليزية، وتغيير حي لاتجاهات الشاشة (RTL/LTR) عبر i18next.
- **🏆 نظام تنافسي**: حالة تطبيق معقدة مدعومة بـ Zustand لإدارة نقاط الفريق وحفظ إعدادات اللاعب.
- **📱 توافقية عالية (Cross-Platform)**: يتم تصدير اللعبة كنسخة ويب (Web)، وتطبيق حاسوب (Desktop)، وتطبيق هاتف (Mobile) من نفس شيفرة المصدر الأساسية بفضل بنية Monorepo.

<div align="center">
  <a href="#toc">🔝 العودة للأعلى</a>
</div>

---

## 💻 **التقنيات المستخدمة** <a id="tech-stack"></a>
- **Turborepo**: لإدارة بنية الـ Monorepo بكفاءة عالية.
- **Next.js & React**: لخدمة الواجهات الأمامية بتجربة أداء مذهلة.
- **Tauri 2.0 (Rust)**: لتصدير الـ Web App إلى تطبيقات Native سريعة وخفيفة بالكمبيوتر.
- **Zustand**: كمدير حالة (State Manager) مرن وسريع للتحكم باللعبة.
- **TailwindCSS**: للتصميم المتجاوب والسريع.
- **FSD Architecture**: الهيكلية المعمارية لتقسيم الميزات (Feature-Sliced Design).

<div align="center">
  <a href="#toc">🔝 العودة للأعلى</a>
</div>

---

## 🚀 **ابدأ الآن** <a id="getting-started"></a>

### المتطلبات الأساسية
- [x] **Node.js (v18+)**
- [x] **pnpm** (مثبت عالمياً)

### خطوات التثبيت
1. استنساخ المستودع:
   ```bash
   git clone https://github.com/Ahmad-J-Bary/power-letter-for-puzzles.git
   cd PowerLetter-for-Puzzles
   ```

2. تثبيت الحزم:
   ```bash
   pnpm install
   ```

3. تشغيل نسخة الويب:
   ```bash
   pnpm dev:web
   ```

4. أو تشغيل نسخة سطح المكتب:
   ```bash
   pnpm dev:desktop
   ```

<div align="center">
  <a href="#toc">🔝 العودة للأعلى</a>
</div>

---

## 🎮 **محرك الألعاب (Game Engine Factory)** <a id="game-engine"></a>
يكمن السر في قابلية التوسع من خلال تطبيق نمط المصنع (Factory Pattern). يقوم هذا المحرك المركزي، ذو الواجهة الموحدة، بالاستماع إلى مدخلات المستخدمين (Reducers) وإعادة بث الحالات المتغيرة لكل نوع من أنواع الألعاب السبع المختلفة، مما يبقي المنطق الأساسي معزولاً ويسهل إضافة ألعاب جديدة بأقل جهد برمجي.

<div align="center">
  <a href="#toc">🔝 العودة للأعلى</a>
</div>

---

## 📁 **هيكلية المشروع (FSD & Monorepo)** <a id="project-structure"></a>
 ```bash
 PowerLetter-for-Puzzles/
 ├── apps/
 │   ├── web/                    # تطبيق الـ Next.js (Web)
 │   └── desktop/                # تطبيق الـ Tauri (Desktop/Mobile)
 ├── packages/
 │   ├── core/                   # (FSD Logic) الـ Reducers ومحرك الألعاب و Zustand
 │   ├── ui/                     # مكونات الواجهة (FSD UI) والأنماط المعزولة
 │   ├── config/                 # إعدادات الـ Tailwind و ESLint المشتركة
 │   └── api-bindings/           # (في حالة وجود اتصال خلفي)
 └── locales/                    # التوثيق والترجمة
 ```

<div align="center">
  <a href="#toc">🔝 العودة للأعلى</a>
</div>

---

## 📜 **التراخيص** <a id="license"></a>
هذا المشروع مرخص بموجب رخصة MIT. راجع ملف `LICENSE` لمزيد من المعلومات.

<div align="center">
  <a href="#toc">🔝 العودة للأعلى</a>
</div>

<p align="center"> تم التطوير بكل ❤️ بواسطة <a href="https://github.com/Ahmad-J-Bary">@Ahmad Abdelbary</a> </p>
