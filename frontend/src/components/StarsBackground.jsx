import { useEffect } from 'react';

function generateShadows(n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const x = Math.floor(Math.random() * 2000);
    const y = Math.floor(Math.random() * 2000);
    out.push(`${x}px ${y}px #FFF`);
  }
  return out.join(', ');
}

const StarsBackground = () => {
  useEffect(() => {
    const small  = generateShadows(700);
    const medium = generateShadows(200);
    const large  = generateShadows(100);

    const style = document.createElement('style');
    style.id = 'hero-stars-css';
    style.textContent = `
      .hero-stars-wrap {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        z-index: 0;
      }
      .hs1 {
        position: absolute;
        width: 1px; height: 1px;
        background: transparent;
        box-shadow: ${small};
        animation: animStar 50s linear infinite;
      }
      .hs1::after {
        content: " ";
        position: absolute;
        left: 2000px;
        width: 1px; height: 1px;
        background: transparent;
        box-shadow: ${small};
      }
      .hs2 {
        position: absolute;
        width: 2px; height: 2px;
        background: transparent;
        box-shadow: ${medium};
        animation: animStar 100s linear infinite;
      }
      .hs2::after {
        content: " ";
        position: absolute;
        left: 2000px;
        width: 2px; height: 2px;
        background: transparent;
        box-shadow: ${medium};
      }
      .hs3 {
        position: absolute;
        width: 3px; height: 3px;
        background: transparent;
        box-shadow: ${large};
        animation: animStar 150s linear infinite;
      }
      .hs3::after {
        content: " ";
        position: absolute;
        left: 2000px;
        width: 3px; height: 3px;
        background: transparent;
        box-shadow: ${large};
      }
      @keyframes animStar {
        from { transform: translateX(0px); }
        to   { transform: translateX(-2000px); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      const el = document.getElementById('hero-stars-css');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="hero-stars-wrap">
      <div className="hs1" />
      <div className="hs2" />
      <div className="hs3" />
    </div>
  );
};

export default StarsBackground;
