import clsx from "clsx";
import svgPaths from "./svg-lwsx26q8zx";
import imgScreenshot20260224At1511301 from "figma:asset/a801057e54da16ed98c5ecb3d99195543f0ac4fe.png";
import imgDonJulioReposadoTequila70ClTequilaMezcal328469160264832 from "figma:asset/c53c7a45987dfc7eb6c4e7a8d3d99e4b06d4258b.png";
import imgPhoto15885142064689657A68C7B951 from "figma:asset/ad1a6d3445d99ccf8e1db21ccbcdb6d9a41581d8.png";
import imgPhoto1622912789333Ba8Bf8242E271 from "figma:asset/eb15f2ca8fa38722649c3aca5b016c8a354485e5.png";
import imgCard from "figma:asset/77ee3dd8aebd716db92dddc4d8a398ddcb374b8c.png";
import { imgFill } from "./svg-yyqf4";
type WrapperProps = {
  additionalClassNames?: string;
};

function Wrapper({ children, additionalClassNames = "" }: React.PropsWithChildren<WrapperProps>) {
  return (
    <div style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties} className={clsx("-translate-x-1/2 -translate-y-1/2 absolute flex h-[202.435px] items-center justify-center w-[270.317px]", additionalClassNames)}>
      <div className="-rotate-15 flex-none">
        <div className="flex flex-col font-['Spectral:SemiBold_Italic',sans-serif] h-[145px] italic justify-center leading-[0] relative text-[#1b180e] text-[20px] text-center tracking-[-0.6px] w-[241px]">{children}</div>
      </div>
    </div>
  );
}
type PaymentConfirmationSeparatorProps = {
  additionalClassNames?: string;
};

function PaymentConfirmationSeparator({ additionalClassNames = "" }: PaymentConfirmationSeparatorProps) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <div className="absolute bg-[#c6c6c8] bottom-1/2 left-0 right-0 top-0" data-name="Rectangle" />
    </div>
  );
}
type Text2Props = {
  text: string;
};

function Text2({ text }: Text2Props) {
  return (
    <Wrapper additionalClassNames="left-[calc(50%+1417.16px)] top-[calc(50%+395.22px)]">
      <p className="leading-[60px]">{text}</p>
    </Wrapper>
  );
}
type Text1Props = {
  text: string;
};

function Text1({ text }: Text1Props) {
  return (
    <Wrapper additionalClassNames="left-[calc(50%+1345.16px)] top-[calc(50%-194.78px)]">
      <p className="leading-[86.917px]">{text}</p>
    </Wrapper>
  );
}
type TextProps = {
  text: string;
  additionalClassNames?: string;
};

function Text({ text, additionalClassNames = "" }: TextProps) {
  return (
    <div className={clsx("-translate-x-1/2 absolute bg-[#262626] content-stretch flex h-[40px] items-center justify-center left-1/2 px-[20px] py-[10px] rounded-[5px] w-[352px]", additionalClassNames)}>
      <p className="font-['Arial:Bold',sans-serif] leading-[22px] not-italic relative shrink-0 text-[15px] text-center text-white whitespace-nowrap">{text}</p>
    </div>
  );
}

export default function MacBookPro() {
  return (
    <div className="bg-white relative size-full" data-name="MacBook Pro 16' - 7">
      <div className="absolute h-[1117px] left-0 top-0 w-[1728px]" data-name="Screenshot 2026-02-24 at 15.11.30 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[120.55%] left-[-10.2%] max-w-none top-[-12.83%] w-[120.41%]" src={imgScreenshot20260224At1511301} />
        </div>
      </div>
      <div className="absolute bg-black h-[1117px] left-0 top-0 w-[1728px]" />
      <div className="-translate-y-1/2 absolute bg-black border-4 border-solid border-white h-[874px] left-[226px] overflow-clip rounded-[25px] top-[calc(50%+0.5px)] w-[402px]" data-name="iPhone 16 & 17 Pro - 7">
        <Text1 text="A colour" />
        <Text2 text="A photo of your dog?" />
        <div className="absolute bg-white h-[750px] left-0 rounded-tl-[25px] rounded-tr-[25px] shadow-[0px_-5px_25px_0px_rgba(0,0,0,0.2)] top-[120px] w-[394px]">
          <div className="-translate-x-1/2 absolute h-0 left-1/2 top-[11px] w-[60px]">
            <div className="absolute inset-[-2px_-3.33%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 4">
                <path d="M2 2H62" id="Line 1" stroke="var(--stroke-0, #DEDFDC)" strokeLinecap="round" strokeWidth="4" />
              </svg>
            </div>
          </div>
          <p className="absolute font-['Arial:Bold',sans-serif] leading-[1.1] left-[calc(50%-49px)] not-italic text-[16px] text-black top-[29px] whitespace-nowrap">xxx.com/cart</p>
          <Text text="Checkout" additionalClassNames="top-[620px]" />
          <Text text="Continue with Apple Pay" additionalClassNames="top-[672px]" />
          <div className="absolute h-[126px] left-[24px] top-[162px] w-[72px]" data-name="don-julio-reposado-tequila-70-cl-tequila-mezcal-32846916026483 2">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[113.56%] left-[-28.4%] max-w-none top-[-6.1%] w-[158.58%]" src={imgDonJulioReposadoTequila70ClTequilaMezcal328469160264832} />
            </div>
          </div>
          <div className="absolute h-[53px] left-[24px] top-[328px] w-[99px]" data-name="photo-1588514206468-9657a68c7b95 1">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[166.27%] left-[-12.1%] max-w-none top-[-39.02%] w-[135.03%]" src={imgPhoto15885142064689657A68C7B951} />
            </div>
          </div>
          <div className="absolute h-[71px] left-[24px] top-[424px] w-[75px]" data-name="photo-1622912789333-ba8bf8242e27 1">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[127.45%] left-[-41.18%] max-w-none top-[-12.75%] w-[182.36%]" src={imgPhoto1622912789333Ba8Bf8242E271} />
            </div>
          </div>
          <div className="-translate-y-1/2 absolute flex flex-col font-['Arial:Bold',sans-serif] justify-center leading-[0] left-[24px] not-italic text-[#0d0d0d] text-[20px] top-[106px] whitespace-nowrap">
            <p className="leading-[32px]">Your Cart</p>
          </div>
          <div className="-translate-y-1/2 absolute flex flex-col font-['Arial:Bold',sans-serif] justify-center leading-[0] left-[21px] not-italic text-[#0d0d0d] text-[20px] top-[558px] whitespace-nowrap">
            <p className="leading-[32px]">TOTAL</p>
          </div>
          <div className="-translate-y-1/2 absolute flex flex-col font-['Arial:Bold',sans-serif] justify-center leading-[0] left-[317px] not-italic text-[#0d0d0d] text-[20px] top-[558px] whitespace-nowrap">
            <p className="leading-[32px]">$82.99</p>
          </div>
          <p className="absolute font-['Arial:Italic',sans-serif] italic leading-[1.4] left-[132px] text-[18px] text-black top-[225px] w-[187px]">Reposado Tequlia</p>
          <p className="absolute font-['Arial:Italic',sans-serif] italic leading-[1.4] left-[132px] text-[18px] text-black top-[338px] w-[140px]">Lime</p>
          <p className="absolute font-['Arial:Italic',sans-serif] italic leading-[1.4] left-[132px] text-[18px] text-black top-[451px] w-[140px]">Grapefruit</p>
        </div>
      </div>
      <div className="-translate-y-1/2 absolute bg-black border-4 border-solid border-white h-[874px] left-[743px] overflow-clip rounded-[25px] top-[calc(50%+0.5px)] w-[402px]" data-name="iPhone 16 & 17 Pro - 8">
        <Text1 text="A colour" />
        <Text2 text="A photo of your dog?" />
        <div className="absolute contents inset-[calc(53.09%+0.25px)_calc(1.24%-3.9px)_calc(0.46%-3.96px)_calc(1%-3.92px)]">
          <div className="absolute inset-[53.09%_1.24%_0.46%_1%]" data-name="Apple Pay Sheet">
            <div className="absolute bg-[#ebebeb] inset-0 rounded-tl-[10px] rounded-tr-[10px]" data-name="Background" />
            <div className="absolute bg-[#f2f2f7] h-[116px] left-0 right-0 top-[150px]" data-name="Card Info Lockup 5 Lines">
              <div className="absolute bg-[#ebebeb] inset-0" data-name="Background" />
              <div className="absolute bg-white h-[116px] left-[16px] right-[16px] rounded-[12px] top-0" data-name="Platter" />
              <p className="absolute font-['SF_Pro_Text:Regular',sans-serif] leading-[22px] left-[86px] not-italic right-[54px] text-[17px] text-black top-[78px]">W8 6JQ, London, UK</p>
              <p className="absolute font-['SF_Pro_Text:Regular',sans-serif] leading-[22px] left-[86px] not-italic right-[54px] text-[17px] text-black top-[56px]">Flat 11, 90 Lexham Gardens</p>
              <p className="absolute font-['SF_Pro_Text:Regular',sans-serif] leading-[22px] left-[86px] not-italic right-[54px] text-[17px] text-black top-[34px]">Riley Jones</p>
              <p className="absolute font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] left-[86px] right-[54px] text-[15px] text-[rgba(60,60,67,0.6)] top-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                Ship to
              </p>
              <div className="absolute left-[34px] size-[36px] top-[16px]" data-name="Icon">
                <div className="absolute bg-[#f2f2f7] inset-0 rounded-[6px]" data-name="Platter" />
                <p className="absolute font-['SF_Pro:Regular_Italic',sans-serif] font-normal h-[22px] italic leading-[22px] left-[16.67%] right-[16.67%] text-[17px] text-black text-center top-[calc(50%-11px)]" style={{ fontVariationSettings: "'YAXS' 400" }}>
                  􀎟
                </p>
              </div>
            </div>
            <div className="absolute h-[69px] left-0 right-0 top-[69px]" data-name="Payment Card Info Lockup">
              <div className="absolute bg-[#ebebeb] inset-0" data-name="container" />
              <div className="absolute bg-white h-[69px] left-[16px] right-[16px] rounded-[12px] top-0" data-name="Platter" />
              <p className="absolute font-['SF_Pro_Text:Regular',sans-serif] leading-[20px] left-[86px] not-italic right-[54px] text-[15px] text-[rgba(60,60,67,0.6)] top-[36px]">•••• 1234</p>
              <p className="absolute font-['SF_Pro:Regular',sans-serif] font-normal leading-[22px] left-[86px] text-[17px] text-black top-[16px] w-[250px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                Apple Card
              </p>
              <div className="absolute h-[25px] left-[32px] top-[16px] w-[40px]" data-name="Card Icon">
                <div className="-translate-y-1/2 absolute h-[25px] left-0 top-1/2 w-[40px]" data-name="Card">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgCard} />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute h-[64px] left-0 right-0 top-0" data-name="Navigation Bar">
              <div className="absolute overflow-clip right-[16px] size-[30px] top-[17px]" data-name="Close Button Light">
                <div className="-translate-y-1/2 absolute right-0 size-[30px] top-1/2" data-name="Oval">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
                    <circle cx="15" cy="15" fill="var(--fill-0, #767680)" fillOpacity="0.12" id="Oval" r="15" />
                  </svg>
                </div>
                <div className="-translate-y-1/2 absolute flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center leading-[0] right-[15px] size-[30px] text-[16px] text-[rgba(60,60,67,0.6)] text-center top-1/2 tracking-[-0.32px] translate-x-1/2" style={{ fontVariationSettings: "'wdth' 100" }}>
                  <p className="leading-[21px]">􀅾</p>
                </div>
              </div>
              <p className="absolute font-['SF_Pro:Medium',sans-serif] font-[510] leading-[normal] left-[16px] text-[28px] text-black top-[14px] tracking-[0.9px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                Pay
              </p>
            </div>
          </div>
          <div className="absolute inset-[79.41%_1.24%_0.46%_1%]" data-name="Payment Confirmation">
            <div className="absolute bottom-0 flex h-[176px] items-center justify-center left-0 right-0">
              <div className="-scale-y-100 flex-none h-[176px] w-[393px]">
                <div className="backdrop-blur-[27.183px] bg-white size-full" data-name="Background" />
              </div>
            </div>
            <div className="absolute inset-[44.32%_0_0_0]" data-name="Confirm Payment Instruction">
              <div className="absolute inset-[65.31%_32.82%_0_32.82%]" data-name="Home Indicator" />
              <p className="absolute font-['SF_Pro:Regular',sans-serif] font-normal leading-[18px] left-[107.5px] right-[105.5px] text-[15px] text-black text-center top-[calc(50%-3.44px)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                Confirm with Side Button
              </p>
              <div className="-translate-x-1/2 -translate-y-1/2 absolute contents left-1/2 top-[calc(50%-22.74px)]" data-name="Glyph - Confirm with Button">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute contents left-1/2 top-[calc(50%-22.74px)]" data-name="Combined Shape">
                  <div className="-translate-x-1/2 -translate-y-1/2 absolute flex items-center justify-center left-1/2 size-[32px] top-[calc(50%-22.74px)]">
                    <div className="-scale-y-100 flex-none rotate-180">
                      <div className="rounded-[21px] size-[32px]" data-name="Mask" />
                    </div>
                  </div>
                  <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[26.667px] items-center justify-center left-[calc(50%-8.76px)] top-[calc(50%-14.74px)] w-[16px]">
                    <div className="-scale-y-100 flex-none rotate-180">
                      <div className="bg-[rgba(191,207,227,0.2)] h-[26.667px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0.762px_-10.667px] mask-size-[32px_32px] rounded-[2px] w-[16px]" data-name="Fill" style={{ maskImage: `url('${imgFill}')` }} />
                    </div>
                  </div>
                  <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[30.477px] left-[calc(50%-9.14px)] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[3.429px_-9.524px] mask-size-[32px_32px] top-[calc(50%-13.98px)] w-[20.571px]" data-name="Frame" style={{ maskImage: `url('${imgFill}')` }}>
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.5713 30.4766">
                      <path d={svgPaths.p2696b980} fill="var(--fill-0, #007AFF)" id="Frame" />
                    </svg>
                  </div>
                </div>
                <div className="-translate-x-1/2 -translate-y-1/2 absolute flex items-center justify-center left-1/2 size-[32px] top-[calc(50%-22.74px)]">
                  <div className="-scale-y-100 flex-none rotate-180">
                    <div className="relative rounded-[21px] size-[32px]" data-name="Ring">
                      <div aria-hidden="true" className="absolute border-[#007aff] border-[1.5px] border-solid inset-[-1.5px] pointer-events-none rounded-[22.5px]" />
                    </div>
                  </div>
                </div>
                <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[8.381px] left-[calc(50%+7.24px)] top-[calc(50%-23.12px)] w-[9.143px]" data-name="Arrow">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.14286 8.38095">
                    <path d={svgPaths.p10baca00} fill="var(--fill-0, #007AFF)" id="Arrow" />
                  </svg>
                </div>
              </div>
            </div>
            <PaymentConfirmationSeparator additionalClassNames="inset-[44.32%_0_55.11%_0]" />
            <PaymentConfirmationSeparator additionalClassNames="inset-[0_0_99.43%_0]" />
            <div className="absolute inset-[17.33%_8.21%_72.44%_89.23%]" data-name="Chevron">
              <div className="absolute inset-[0_0_0_-20%] overflow-clip" data-name="Chevron">
                <p className="absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[normal] right-0 text-[15px] text-black text-right top-[calc(50%-9px)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                  􀆊
                </p>
              </div>
            </div>
            <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[4.1%] not-italic right-[48.72%] text-[30px] text-black top-[calc(50%-58px)] tracking-[0.7345px]">$82.99</p>
            <p className="absolute font-['SF_Pro_Text:Regular',sans-serif] leading-[20px] left-[4.1%] not-italic right-[15.64%] text-[15px] text-[rgba(60,60,67,0.6)] top-[calc(50%-76px)]">Pay Store</p>
            <div className="-translate-x-1/2 absolute bottom-[8px] flex h-[5px] items-center justify-center left-1/2 w-[139px]">
              <div className="-scale-y-100 flex-none rotate-180">
                <div className="bg-black h-[5px] rounded-[100px] w-[139px]" data-name="Home Indicator" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}