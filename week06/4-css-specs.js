// 获取方法：
Array.prototype.slice.call(document.querySelector(''));

const specs = [
  {
    tag: 'css graphics i18n xml',
    name: 'Requirements for Chinese Text Layout中文排版需求',
    url: 'https://www.w3.org/TR/2020/WD-clreq-20200801/',
  },
  {
    tag: 'css',
    name: 'Media Queries Level 5',
    url: 'https://www.w3.org/TR/2020/WD-mediaqueries-5-20200731/',
  },
  {
    tag: 'css',
    name: 'Media Queries Level 4',
    url: 'https://www.w3.org/TR/2020/CR-mediaqueries-4-20200721/',
  },
  {
    tag: 'css i18n',
    name: 'CSS Lists Module Level 3',
    url: 'https://www.w3.org/TR/2020/WD-css-lists-3-20200709/',
  },
  {
    tag: 'css',
    name: 'CSS Inline Layout Module Level 3',
    url: 'https://www.w3.org/TR/2020/WD-css-inline-3-20200618/',
  },
  {
    tag: 'css',
    name: 'CSS Overflow Module Level 3',
    url: 'https://www.w3.org/TR/2020/WD-css-overflow-3-20200603/',
  },
  {
    tag: 'css',
    name: 'CSS Containment Module Level 2',
    url: 'https://www.w3.org/TR/2020/WD-css-contain-2-20200603/',
  },
  {
    tag: 'css html i18n',
    name: 'Encoding',
    url: 'https://www.w3.org/TR/2020/NOTE-encoding-20200602/',
  },
  {
    tag: 'css graphics i18n xml',
    name: 'Requirements for Hangul Text Layout and Typography : 한국어 텍스트 레이아웃 및 타이포그래피를 위한 요구사항',
    url: 'https://www.w3.org/TR/2020/NOTE-klreq-20200527/',
  },
  {
    tag: 'css',
    name: 'CSS Box Sizing Module Level 4',
    url: 'https://www.w3.org/TR/2020/WD-css-sizing-4-20200526/',
  },
  {
    tag: 'css graphics i18n xml',
    name: 'Ethiopic Layout Requirements',
    url: 'https://www.w3.org/TR/2020/WD-elreq-20200526/',
  },
  {
    tag: 'css',
    name: 'CSS Positioned Layout Module Level 3',
    url: 'https://www.w3.org/TR/2020/WD-css-position-3-20200519/',
  },
  {
    tag: 'css',
    name: 'CSS Display Module Level 3',
    url: 'https://www.w3.org/TR/2020/CR-css-display-3-20200519/',
  },
  {
    tag: 'css',
    name: 'CSS Text Decoration Module Level 4',
    url: 'https://www.w3.org/TR/2020/WD-css-text-decor-4-20200506/',
  },
  {
    tag: 'css i18n',
    name: 'CSS Text Module Level 3',
    url: 'https://www.w3.org/TR/2020/WD-css-text-3-20200429/',
  },
  {
    tag: 'css i18n',
    name: 'CSS Ruby Layout Module Level 1',
    url: 'https://www.w3.org/TR/2020/WD-css-ruby-1-20200429/',
  },
  {
    tag: 'css',
    name: 'CSS Box Model Module Level 3',
    url: 'https://www.w3.org/TR/2020/WD-css-box-3-20200421/',
  },
  {
    tag: 'css',
    name: 'CSS Box Model Module Level 4',
    url: 'https://www.w3.org/TR/2020/WD-css-box-4-20200421/',
  },
  {
    tag: 'css',
    name: 'CSS Box Alignment Module Level 3',
    url: 'https://www.w3.org/TR/2020/WD-css-align-3-20200421/',
  },
  {
    tag: 'css',
    name: 'CSS Color Adjustment Module Level 1',
    url: 'https://www.w3.org/TR/2020/WD-css-color-adjust-1-20200402/',
  },
  {
    tag: 'css media',
    name: 'CSS Speech Module',
    url: 'https://www.w3.org/TR/2020/CR-css-speech-1-20200310/',
  },
  {
    tag: 'css',
    name: 'CSS Conditional Rules Module Level 4',
    url: 'https://www.w3.org/TR/2020/WD-css-conditional-4-20200303/',
  },
  {
    tag: 'css',
    name: 'CSS Transforms Module Level 2',
    url: 'https://www.w3.org/TR/2020/WD-css-transforms-2-20200303/',
  },
  {
    tag: 'css',
    name: 'CSS Color Module Level 5',
    url: 'https://www.w3.org/TR/2020/WD-css-color-5-20200303/',
  },
  {
    tag: 'css',
    name: 'CSS Scroll Anchoring Module Level 1',
    url: 'https://www.w3.org/TR/2020/WD-css-scroll-anchoring-1-20200211/',
  },
  {
    tag: 'css',
    name: 'Resize Observer',
    url: 'https://www.w3.org/TR/2020/WD-resize-observer-1-20200211/',
  },
  {
    tag: 'accessibility css html',
    name: 'Timed Text Markup Language 2 (TTML2) (2nd Edition)',
    url: 'https://www.w3.org/TR/2020/CR-ttml2-20200128/',
  },
  {
    tag: 'css',
    name: 'CSS Basic User Interface Module Level 4',
    url: 'https://www.w3.org/TR/2020/WD-css-ui-4-20200124/',
  },
  {
    tag: 'css',
    name: 'CSS Writing Modes Level 3',
    url: 'https://www.w3.org/TR/2019/REC-css-writing-modes-3-20191210/',
  },
  {
    tag: 'css',
    name: 'CSS Grid Layout Module Level 2',
    url: 'https://www.w3.org/TR/2019/WD-css-grid-2-20191203/',
  },
  {
    tag: 'css',
    name: 'CSS Spatial Navigation Level 1',
    url: 'https://www.w3.org/TR/2019/WD-css-nav-1-20191126/',
  },
  {
    tag: 'css',
    name: 'CSS Containment Module Level 1',
    url: 'https://www.w3.org/TR/2019/REC-css-contain-1-20191121/',
  },
  {
    tag: 'css',
    name: 'CSS Text Module Level 4',
    url: 'https://www.w3.org/TR/2019/WD-css-text-4-20191113/',
  },
  {
    tag: 'css',
    name: 'CSS Fonts Module Level 4',
    url: 'https://www.w3.org/TR/2019/WD-css-fonts-4-20191113/',
  },
  {
    tag: 'css',
    name: 'CSS Color Module Level 4',
    url: 'https://www.w3.org/TR/2019/WD-css-color-4-20191105/',
  },
  {
    tag: 'css',
    name: 'CSS Properties and Values API Level 1',
    url: 'https://www.w3.org/TR/2019/WD-css-properties-values-api-1-20191025/',
  },
  {
    tag: 'css',
    name: 'CSS Multi-column Layout Module Level 1',
    url: 'https://www.w3.org/TR/2019/WD-css-multicol-1-20191015/',
  },
  {
    tag: 'css',
    name: 'CSS Images Module Level 3',
    url: 'https://www.w3.org/TR/2019/CR-css-images-3-20191010/',
  },
  {
    tag: 'css',
    name: 'CSS Text Decoration Module Level 3',
    url: 'https://www.w3.org/TR/2019/CR-css-text-decor-3-20190813/',
  },
  {
    tag: 'css',
    name: 'CSS Generated Content Module Level 3',
    url: 'https://www.w3.org/TR/2019/WD-css-content-3-20190802/',
  },
  {
    tag: 'css',
    name: 'CSS Writing Modes Level 4',
    url: 'https://www.w3.org/TR/2019/CR-css-writing-modes-4-20190730/',
  },
  {
    tag: 'css',
    name: 'CSS Table Module Level 3',
    url: 'https://www.w3.org/TR/2019/WD-css-tables-3-20190727/',
  },
  {
    tag: 'css',
    name: 'CSS Syntax Module Level 3',
    url: 'https://www.w3.org/TR/2019/CR-css-syntax-3-20190716/',
  },
  {
    tag: 'css',
    name: 'CSS Animation Worklet API',
    url: 'https://www.w3.org/TR/2019/WD-css-animation-worklet-1-20190625/',
  },
  {
    tag: 'css',
    name: 'CSS Overscroll Behavior Module Level 1',
    url: 'https://www.w3.org/TR/2019/WD-css-overscroll-1-20190606/',
  },
  {
    tag: 'css',
    name: 'CSS Values and Units Module Level 3',
    url: 'https://www.w3.org/TR/2019/CR-css-values-3-20190606/',
  },
  {
    tag: 'css',
    name: 'CSS Intrinsic & Extrinsic Sizing Module Level 3',
    url: 'https://www.w3.org/TR/2019/WD-css-sizing-3-20190522/',
  },
  {
    tag: 'css',
    name: 'CSS Easing Functions Level 1',
    url: 'https://www.w3.org/TR/2019/CR-css-easing-1-20190430/',
  },
  {
    tag: 'accessibility css html',
    name: 'TTML Media Type Definition and Profile Registry',
    url: 'https://www.w3.org/TR/2019/NOTE-ttml-profile-registry-20190411/',
  },
  {
    tag: 'css graphics html',
    name: 'WebVTT: The Web Video Text Tracks Format',
    url: 'https://www.w3.org/TR/2019/CR-webvtt1-20190404/',
  },
  {
    tag: 'css',
    name: 'Non-element  Selectors  Module  Level 1',
    url: 'https://www.w3.org/TR/2019/NOTE-selectors-nonelement-1-20190402/',
  },
  {
    tag: 'css',
    name: 'CSS Scroll Snap Module Level 1',
    url: 'https://www.w3.org/TR/2019/CR-css-scroll-snap-1-20190319/',
  },
  {
    tag: 'css',
    name: 'CSS Pseudo-Elements Module Level 4',
    url: 'https://www.w3.org/TR/2019/WD-css-pseudo-4-20190225/',
  },
  {
    tag: 'css',
    name: 'CSS Transforms Module Level 1',
    url: 'https://www.w3.org/TR/2019/CR-css-transforms-1-20190214/',
  },
  {
    tag: 'css',
    name: 'CSS Values and Units Module Level 4',
    url: 'https://www.w3.org/TR/2019/WD-css-values-4-20190131/',
  },
  {
    tag: 'css',
    name: 'CSS Snapshot 2018',
    url: 'https://www.w3.org/TR/2019/NOTE-css-2018-20190122/',
  },
  {
    tag: 'css',
    name: 'CSS Fragmentation Module Level 4',
    url: 'https://www.w3.org/TR/2018/WD-css-break-4-20181218/',
  },
  {
    tag: 'css graphics',
    name: 'Motion Path Module Level 1',
    url: 'https://www.w3.org/TR/2018/WD-motion-1-20181218/',
  },
  {
    tag: 'css graphics',
    name: 'Filter Effects Module Level 1',
    url: 'https://www.w3.org/TR/2018/WD-filter-effects-1-20181218/',
  },
  {
    tag: 'css graphics',
    name: 'Geometry Interfaces Module Level 1',
    url: 'https://www.w3.org/TR/2018/CR-geometry-1-20181204/',
  },
  {
    tag: 'css',
    name: 'CSS Fragmentation Module Level 3',
    url: 'https://www.w3.org/TR/2018/CR-css-break-3-20181204/',
  },
  {
    tag: 'css',
    name: 'Selectors Level 4',
    url: 'https://www.w3.org/TR/2018/WD-selectors-4-20181121/',
  },
  {
    tag: 'css',
    name: 'CSS Flexible Box Layout Module Level 1',
    url: 'https://www.w3.org/TR/2018/CR-css-flexbox-1-20181119/',
  },
  {
    tag: 'css',
    name: 'CSS Shadow Parts',
    url: 'https://www.w3.org/TR/2018/WD-css-shadow-parts-1-20181115/',
  },
  {
    tag: 'css',
    name: 'Selectors Level 3',
    url: 'https://www.w3.org/TR/2018/REC-selectors-3-20181106/',
  },
  {
    tag: 'css',
    name: 'CSS Paged Media Module Level 3',
    url: 'https://www.w3.org/TR/2018/WD-css-page-3-20181018/',
  },
  {
    tag: 'css',
    name: 'CSS Animations Level 1',
    url: 'https://www.w3.org/TR/2018/WD-css-animations-1-20181011/',
  },
  {
    tag: 'css graphics',
    name: 'Web Animations',
    url: 'https://www.w3.org/TR/2018/WD-web-animations-1-20181011/',
  },
  {
    tag: 'css',
    name: 'CSS Transitions',
    url: 'https://www.w3.org/TR/2018/WD-css-transitions-1-20181011/',
  },
  {
    tag: 'css',
    name: 'CSS Scrollbars Module Level 1',
    url: 'https://www.w3.org/TR/2018/WD-css-scrollbars-1-20180925/',
  },
  {
    tag: 'css i18n',
    name: 'CSS Fonts Module Level 3',
    url: 'https://www.w3.org/TR/2018/REC-css-fonts-3-20180920/',
  },
  {
    tag: 'css',
    name: 'Cascading  Style  Sheets,  level 1',
    url: 'https://www.w3.org/TR/2018/SPSD-CSS1-20180913/',
  },
  {
    tag: 'css',
    name: 'CSS Cascading and Inheritance Level 3',
    url: 'https://www.w3.org/TR/2018/CR-css-cascade-3-20180828/',
  },
  {
    tag: 'css',
    name: 'CSS Cascading and Inheritance Level 4',
    url: 'https://www.w3.org/TR/2018/CR-css-cascade-4-20180828/',
  },
  {
    tag: 'css',
    name: 'CSS Logical Properties and Values Level 1',
    url: 'https://www.w3.org/TR/2018/WD-css-logical-1-20180827/',
  },
  {
    tag: 'css',
    name: 'CSS Painting API Level 1',
    url: 'https://www.w3.org/TR/2018/CR-css-paint-api-1-20180809/',
  },
  {
    tag: 'css',
    name: 'CSS Basic User Interface Module Level 3 (CSS3 UI)',
    url: 'https://www.w3.org/TR/2018/REC-css-ui-3-20180621/',
  },
  {
    tag: 'css',
    name: 'CSS Color Module Level 3',
    url: 'https://www.w3.org/TR/2018/REC-css-color-3-20180619/',
  },
  {
    tag: 'css graphics',
    name: 'DOMMatrix interface',
    url: 'https://www.w3.org/TR/2018/NOTE-matrix-20180412/',
  },
  {
    tag: 'css',
    name: 'CSS Layout API Level 1',
    url: 'https://www.w3.org/TR/2018/WD-css-layout-api-1-20180412/',
  },
  {
    tag: 'css',
    name: 'CSS Typed OM Level 1',
    url: 'https://www.w3.org/TR/2018/WD-css-typed-om-1-20180410/',
  },
  {
    tag: 'css',
    name: 'CSS Grid Layout Module Level 1',
    url: 'https://www.w3.org/TR/2017/CR-css-grid-1-20171214/',
  },
  {
    tag: 'css',
    name: 'CSS Counter Styles Level 3',
    url: 'https://www.w3.org/TR/2017/CR-css-counter-styles-3-20171214/',
  },
  {
    tag: 'css',
    name: 'CSS Backgrounds and Borders Module Level 3',
    url: 'https://www.w3.org/TR/2017/CR-css-backgrounds-3-20171017/',
  },
  {
    tag: 'css',
    name: 'CSS Overflow Module Level 4',
    url: 'https://www.w3.org/TR/2017/WD-css-overflow-4-20170613/',
  },
  {
    tag: 'css',
    name: 'CSS Image Values and Replaced Content Module Level 4',
    url: 'https://www.w3.org/TR/2017/WD-css-images-4-20170413/',
  },
  {
    tag: 'css',
    name: 'CSS Fill and Stroke Module Level 3',
    url: 'https://www.w3.org/TR/2017/WD-fill-stroke-3-20170413/',
  },
  {
    tag: 'css',
    name: 'CSS Rhythmic Sizing',
    url: 'https://www.w3.org/TR/2017/WD-css-rhythm-1-20170302/',
  },
  {
    tag: 'css i18n xml',
    name: 'Ready-made Counter Styles',
    url: 'https://www.w3.org/TR/2017/NOTE-predefined-counter-styles-20170216/',
  },
  {
    tag: 'css',
    name: 'CSS Snapshot 2017',
    url: 'https://www.w3.org/TR/2017/NOTE-css-2017-20170131/',
  },
  {
    tag: 'css',
    name: 'CSS Round Display Level 1',
    url: 'https://www.w3.org/TR/2016/WD-css-round-display-1-20161222/',
  },
  {
    tag: 'css',
    name: 'Worklets Level 1',
    url: 'https://www.w3.org/TR/2016/WD-worklets-1-20160607/',
  },
  {
    tag: 'css',
    name: 'Cascading Style Sheets Level 2 Revision 2 (CSS 2.2) Specification',
    url: 'https://www.w3.org/TR/2016/WD-CSS22-20160412/',
  },
  {
    tag: 'css',
    name: 'CSS Device Adaptation Module Level 1',
    url: 'https://www.w3.org/TR/2016/WD-css-device-adapt-1-20160329/',
  },
  {
    tag: 'css',
    name: 'CSS Object Model (CSSOM)',
    url: 'https://www.w3.org/TR/2016/WD-cssom-1-20160317/',
  },
  {
    tag: 'css',
    name: 'CSSOM View Module',
    url: 'https://www.w3.org/TR/2016/WD-cssom-view-1-20160317/',
  },
  {
    tag: 'css',
    name: 'CSS Custom Properties for Cascading Variables Module Level 1',
    url: 'https://www.w3.org/TR/2015/CR-css-variables-1-20151203/',
  },
  {
    tag: 'css',
    name: 'CSS Will Change Module Level 1',
    url: 'https://www.w3.org/TR/2015/CR-css-will-change-1-20151203/',
  },
  {
    tag: 'css',
    name: 'CSS Snapshot 2015',
    url: 'https://www.w3.org/TR/2015/NOTE-css-2015-20151013/',
  },
  {
    tag: 'css',
    name: 'CSS Page Floats',
    url: 'https://www.w3.org/TR/2015/WD-css-page-floats-3-20150915/',
  },
  {
    tag: 'css',
    name: 'Priorities for CSS from the Digital Publishing Interest Group',
    url: 'https://www.w3.org/TR/2015/WD-dpub-css-priorities-20150820/',
  },
  {
    tag: 'css',
    name: 'CSS Template Layout Module',
    url: 'https://www.w3.org/TR/2015/NOTE-css-template-3-20150326/',
  },
  {
    tag: 'css',
    name: 'CSS Exclusions Module Level 1',
    url: 'https://www.w3.org/TR/2015/WD-css3-exclusions-20150115/',
  },
  {
    tag: 'css graphics',
    name: 'Compositing and Blending Level 1',
    url: 'https://www.w3.org/TR/2015/CR-compositing-1-20150113/',
  },
  {
    tag: 'css webapi',
    name: 'Fullscreen',
    url: 'https://www.w3.org/TR/2014/NOTE-fullscreen-20141118/',
  },
  {
    tag: 'css',
    name: 'CSS  Marquee  Module  Level 3',
    url: 'https://www.w3.org/TR/2014/NOTE-css3-marquee-20141014/',
  },
  {
    tag: 'css media',
    name: 'CSS  TV  Profile 1.0',
    url: 'https://www.w3.org/TR/2014/NOTE-css-tv-20141014/',
  },
  {
    tag: 'css',
    name: 'The CSS ‘Reader’ Media Type',
    url: 'https://www.w3.org/TR/2014/NOTE-css3-reader-20141014/',
  },
  {
    tag: 'css',
    name: 'Behavioral Extensions to CSS',
    url: 'https://www.w3.org/TR/2014/NOTE-becss-20141014/',
  },
  {
    tag: 'css',
    name: 'CSS Presentation Levels Module',
    url: 'https://www.w3.org/TR/2014/NOTE-css3-preslev-20141014/',
  },
  {
    tag: 'css',
    name: 'CSS  Mobile  Profile 2.0',
    url: 'https://www.w3.org/TR/2014/NOTE-css-mobile-20141014/',
  },
  {
    tag: 'css',
    name: 'CSS3 Hyperlink Presentation Module',
    url: 'https://www.w3.org/TR/2014/NOTE-css3-hyperlinks-20141014/',
  },
  {
    tag: 'css',
    name: 'CSS Regions Module Level 1',
    url: 'https://www.w3.org/TR/2014/WD-css-regions-1-20141009/',
  },
  {
    tag: 'css',
    name: 'CSS Line Grid Module Level 1',
    url: 'https://www.w3.org/TR/2014/WD-css-line-grid-1-20140916/',
  },
  {
    tag: 'css graphics',
    name: 'CSS Masking Module Level 1',
    url: 'https://www.w3.org/TR/2014/CR-css-masking-1-20140826/',
  },
  {
    tag: 'css',
    name: 'CSS Font Loading Module Level 3',
    url: 'https://www.w3.org/TR/2014/WD-css-font-loading-3-20140522/',
  },
  {
    tag: 'css',
    name: 'CSS Generated Content for Paged Media Module',
    url: 'https://www.w3.org/TR/2014/WD-css-gcpm-3-20140513/',
  },
  {
    tag: 'css graphics html',
    name: 'SVG Integration',
    url: 'https://www.w3.org/TR/2014/WD-svg-integration-20140417/',
  },
  {
    tag: 'css',
    name: 'CSS Scoping Module Level 1',
    url: 'https://www.w3.org/TR/2014/WD-css-scoping-1-20140403/',
  },
  {
    tag: 'css',
    name: 'CSS Shapes Module Level 1',
    url: 'https://www.w3.org/TR/2014/CR-css-shapes-1-20140320/',
  },
  {
    tag: 'css',
    name: 'CSS Namespaces Module Level 3',
    url: 'https://www.w3.org/TR/2014/REC-css-namespaces-3-20140320/',
  },
  {
    tag: 'css html',
    name: 'CSS Style Attributes',
    url: 'https://www.w3.org/TR/2013/REC-css-style-attr-20131107/',
  },
  {
    tag: 'css webapi',
    name: 'Selectors  API  Level 2',
    url: 'https://www.w3.org/TR/2013/NOTE-selectors-api2-20131017/',
  },
  {
    tag: 'css',
    name: 'CSS Conditional Rules Module Level 3',
    url: 'https://www.w3.org/TR/2013/CR-css3-conditional-20130404/',
  },
  {
    tag: 'css',
    name: 'CSS Print Profile',
    url: 'https://www.w3.org/TR/2013/NOTE-css-print-20130314/',
  },
  {
    tag: 'css webapi',
    name: 'Selectors API Level 1',
    url: 'https://www.w3.org/TR/2013/REC-selectors-api-20130221/',
  },
  {
    tag: 'css',
    name: 'Media Queries',
    url: 'https://www.w3.org/TR/2012/REC-css3-mediaqueries-20120619/',
  },
  {
    tag: 'css graphics i18n xml',
    name: 'Requirements for Japanese Text Layout',
    url: 'https://www.w3.org/TR/2012/NOTE-jlreq-20120403/',
  },
  {
    tag: 'css',
    name: 'A MathML for CSS Profile',
    url: 'https://www.w3.org/TR/2011/REC-mathml-for-css-20110607/',
  },
  {
    tag: 'css',
    name: 'Cascading Style Sheets Level 2 Revision 1 (CSS 2.1) Specification',
    url: 'https://www.w3.org/TR/2011/REC-CSS2-20110607/',
  },
  {
    tag: 'css',
    name: 'Cascading Style Sheets (CSS) Snapshot 2007',
    url: 'https://www.w3.org/TR/2011/NOTE-css-beijing-20110512/',
  },
  {
    tag: 'css',
    name: 'Cascading Style Sheets (CSS) Snapshot 2010',
    url: 'https://www.w3.org/TR/2011/NOTE-css-2010-20110512/',
  },
  {
    tag: 'css xml',
    name: 'Associating Style Sheets with XML documents 1.0 (Second Edition)',
    url: 'https://www.w3.org/TR/2010/REC-xml-stylesheet-20101028/',
  },
  {
    tag: 'css dom',
    name: 'Document Object Model (DOM) Level 2 Style Specification',
    url: 'https://www.w3.org/TR/2000/REC-DOM-Level-2-Style-20001113/',
  },
  {
    tag: 'accessibility css',
    name: 'CSS Techniques for Web Content Accessibility Guidelines 1.0',
    url: 'https://www.w3.org/TR/2000/NOTE-WCAG10-CSS-TECHS-20001106/',
  },
  {
    tag: 'css',
    name: 'Aural Cascading Style Sheets (ACSS) Specification',
    url: 'https://www.w3.org/TR/1999/WD-acss-19990902',
  },
  {
    tag: 'css',
    name: 'Positioning HTML Elements with Cascading Style Sheets',
    url: 'https://www.w3.org/TR/1999/WD-positioning-19990902',
  },
  {
    tag: 'css',
    name: 'CSS Printing Extensions',
    url: 'https://www.w3.org/TR/1999/WD-print-19990902',
  },
  {
    tag: 'css',
    name: 'List of suggested extensions to CSS',
    url: 'https://www.w3.org/TR/1998/NOTE-CSS-potential-19981210',
  },
];

let iframe = document.createElement('iframe');
document.body.innerHTML = '';
document.body.appendChild(iframe);

/** 在 element 上监听一次 event 的发生，随后解绑该监听函数 */
function happen(element, event) {
  return new Promise((resolve) => {
    let handler = () => {
      resolve();
      element.removeEventListener(event, handler);
    };
    element.addEventListener(event, handler);
  });
}

void (async function () {
  for (const spec of specs) {
    iframe.src = spec.url;
    console.log(spec.name);
    await happen(iframe, 'load');

    // 访问 iframe.contentDocument.querySelectorAll('.propdef')
  }
})();
