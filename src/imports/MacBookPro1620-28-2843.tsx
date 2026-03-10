import clsx from "clsx";
import svgPaths from "./svg-qds06y8z2f";
import imgScreenshot20260224At1511301 from "figma:asset/a801057e54da16ed98c5ecb3d99195543f0ac4fe.png";
import img30 from "figma:asset/f64e15edc573482617d07e85b330691c46ed8f0e.png";
import imgSafdgdbnf2 from "figma:asset/46012681f417991ceea5ca1a2a5fe36bc79180ea.png";
import { img29 } from "./svg-8yc18";
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

function Helper5() {
  return <p className="mb-0">{`You're in for a night of secrets, suspicion, and Don Julio. Someone at your table has blood on their hands. `}</p>;
}
type Helper4Props = {
  text: string;
  text1: string;
};

function Helper4({ text, text1 }: Helper4Props) {
  return (
    <div className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal h-[140px] leading-[1.25] left-[197px] not-italic text-[12px] text-center text-white top-[363px] w-[252px] whitespace-pre-wrap">
      <Helper5 />
      <p className="mb-0">{text}</p>
      <p className="mb-0">{`Your AI host knows who; but they're not telling. Not yet.`}</p>
      <p className="mb-0">{text1}</p>
      <p>{`Dress sharp. Trust no one. And whatever you do, don't leave your drink unattended.`}</p>
    </div>
  );
}
type Helper3Props = {
  text: string;
  text1: string;
  text2: string;
  text3: string;
  text4: string;
};

function Helper3({ text, text1, text2, text3, text4 }: Helper3Props) {
  return (
    <div className="absolute contents left-[38px] top-[134px]">
      <MaskGroupImage />
      <div className="-translate-x-1/2 absolute capitalize font-['Spectral:Medium_Italic',sans-serif] italic leading-[1.35] left-[201.22px] text-[16.786px] text-center text-white top-[226px] tracking-[3.3572px] w-[284.433px]">
        <p className="mb-0">{text}</p>
        <p>{`Murder Mystery `}</p>
      </div>
      <div className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold h-[51px] leading-none left-[201px] not-italic text-[8px] text-center text-white top-[277px] w-[240px]">
        <p className="mb-0">{text1}</p>
        <p>{text2}</p>
      </div>
      <div className="absolute h-[41px] left-[75px] rounded-[20px] top-[530px] w-[252px]" data-name="Button">
        <div className="absolute bg-white inset-0 rounded-[20px]" />
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold inset-[34.15%_37.74%_31.71%_37.74%] leading-[1.141] not-italic text-[#313131] text-[12px] text-center tracking-[1.8px] whitespace-nowrap">{text3}</p>
      </div>
      <div className="absolute h-[41px] left-[75px] rounded-[20px] top-[581px] w-[252px]" data-name="Button">
        <div className="absolute bg-[#313131] inset-0 rounded-[20px]" />
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold inset-[34.15%_37.74%_31.71%_37.74%] leading-[1.141] not-italic text-[12px] text-center text-white tracking-[1.8px] whitespace-nowrap">{text4}</p>
      </div>
      <div className="absolute contents left-[135px] top-[306px]">
        <div className="absolute bg-[rgba(0,0,0,0.5)] border-[0.614px] border-solid border-white h-[27px] left-[135px] rounded-[57.682px] top-[306px] w-[132px]" />
        <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal h-[12px] leading-[1.495] left-[calc(50%+42px)] not-italic text-[8px] text-right text-white top-[314px] w-[76px]">{"Birch Hotel, London"}</p>
        <div className="absolute inset-[35.7%_60.95%_62.59%_36.82%]" data-name="Vector">
          <div className="absolute inset-[0_0_4.32%_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 14.3526">
              <path d={svgPaths.pfa56900} fill="var(--fill-0, white)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
type Text2Props = {
  text: string;
};

function Text2({ text }: Text2Props) {
  return (
    <div className="content-stretch flex gap-px h-[25px] items-start relative shrink-0">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.1] not-italic opacity-20 relative shrink-0 text-[24px] text-center text-white tracking-[-0.48px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type Text1Props = {
  text: string;
};

function Text1({ text }: Text1Props) {
  return (
    <Wrapper additionalClassNames="left-[calc(50%+1417.16px)] top-[calc(50%+395.22px)]">
      <p className="leading-[60px]">{text}</p>
    </Wrapper>
  );
}
type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return (
    <Wrapper additionalClassNames="left-[calc(50%+1345.16px)] top-[calc(50%-194.78px)]">
      <p className="leading-[86.917px]">{text}</p>
    </Wrapper>
  );
}
type Helper2Props = {
  additionalClassNames?: string;
};

function Helper2({ additionalClassNames = "" }: Helper2Props) {
  return (
    <div className={clsx("absolute content-stretch flex flex-col items-start left-[250px] px-[13px] py-[16px] rounded-[22.5px] size-[45px]", additionalClassNames)}>
      <div aria-hidden="true" className="absolute border border-[#838383] border-dashed inset-0 pointer-events-none rounded-[22.5px]" />
      <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
        <div className="border-[#838383] border-[0.5px] border-solid col-1 ml-0 mt-0 rounded-[0.5px] row-1 size-[4px]" />
        <div className="border-[#838383] border-[0.5px] border-solid col-1 ml-[5px] mt-0 rounded-[0.5px] row-1 size-[4px]" />
        <div className="border-[#838383] border-[0.5px] border-solid col-1 ml-[10px] mt-0 rounded-[0.5px] row-1 size-[4px]" />
        <div className="border-[#838383] border-[0.5px] border-solid col-1 ml-[15px] mt-0 rounded-[0.5px] row-1 size-[4px]" />
        <div className="border-[#838383] border-[0.5px] border-solid col-1 ml-0 mt-[5px] rounded-[0.5px] row-1 size-[4px]" />
        <div className="border-[#838383] border-[0.5px] border-solid col-1 h-[2px] ml-0 mt-[10px] rounded-[0.5px] row-1 w-[19px]" />
        <div className="border-[#838383] border-[0.5px] border-solid col-1 ml-[5px] mt-[5px] rounded-[0.5px] row-1 size-[4px]" />
        <div className="border-[#838383] border-[0.5px] border-solid col-1 ml-[10px] mt-[5px] rounded-[0.5px] row-1 size-[4px]" />
        <div className="border-[#838383] border-[0.5px] border-solid col-1 ml-[15px] mt-[5px] rounded-[0.5px] row-1 size-[4px]" />
      </div>
    </div>
  );
}
type Helper1Props = {
  additionalClassNames?: string;
};

function Helper1({ additionalClassNames = "" }: Helper1Props) {
  return (
    <div className={clsx("absolute content-stretch flex flex-col items-start left-[107px] p-[16px] rounded-[22.5px] size-[45px]", additionalClassNames)}>
      <div aria-hidden="true" className="absolute border border-[#838383] border-dashed inset-0 pointer-events-none rounded-[22.5px]" />
      <div className="relative shrink-0 size-[12px]">
        <div className="absolute inset-[-4.17%_-4.17%_0_-4.17%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 12.5">
            <g id="Group 2">
              <line id="Line 3" stroke="var(--stroke-0, #838383)" strokeLinecap="round" x1="1.20711" x2="12.5" y1="0.5" y2="11.7929" />
              <line id="Line 4" stroke="var(--stroke-0, #838383)" strokeLinecap="round" transform="matrix(-0.707107 0.707107 0.707107 0.707107 12.5 0.5)" x1="0.5" x2="16.4706" y1="-0.5" y2="-0.5" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Helper() {
  return (
    <div className="h-[33px] relative shrink-0 w-[22.009px]">
      <div className="absolute inset-[0_-4.69%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.0714 33">
          <g id="Group 1">
            <rect height="22.6854" id="Rectangle 1" rx="5.15519" stroke="var(--stroke-0, white)" strokeWidth="2.06462" width="10.3104" x="6.87606" y="1.03231" />
            <path d={svgPaths.p27f3cf60} id="Vector 1" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2.0625" />
            <line id="Line 2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2.0625" x1="11.6875" x2="11.6875" y1="29.2188" y2="31.9688" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function MaskGroupImage() {
  return (
    <div className="absolute contents left-[42px] top-[138px]">
      <div className="absolute contents left-[-98px] top-[117.21px]">
        <div className="absolute flex h-[550.933px] items-center justify-center left-[-98px] top-[117.21px] w-[466px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
          <div className="flex-none rotate-90">
            <div className="h-[466px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[140px_20.789px] mask-size-[318px_521px] relative w-[550.933px]" data-name="29" style={{ maskImage: `url('${img29}')` }}>
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img30} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute h-[520px] left-[-110px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[152px_0px] mask-size-[318px_521px] rounded-[15.919px] top-[138px] w-[619px]" data-name="safdgdbnf 2" style={{ maskImage: `url('${img29}')` }}>
        <img alt="" className="absolute inset-0 max-w-none object-cover opacity-70 pointer-events-none rounded-[15.919px] size-full" src={imgSafdgdbnf2} />
      </div>
    </div>
  );
}

export default function MacBookPro() {
  return (
    <div className="bg-white relative size-full" data-name="MacBook Pro 16' - 20">
      <div className="absolute h-[1117px] left-0 top-0 w-[1728px]" data-name="Screenshot 2026-02-24 at 15.11.30 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[120.55%] left-[-10.2%] max-w-none top-[-12.83%] w-[120.41%]" src={imgScreenshot20260224At1511301} />
        </div>
      </div>
      <div className="absolute bg-black h-[1117px] left-0 top-0 w-[2849px]" />
      <div className="-translate-y-1/2 absolute bg-black border-4 border-solid border-white h-[874px] left-[1033px] overflow-clip rounded-[25px] top-[calc(50%-417px)] w-[402px]" data-name="iPhone 16 & 17 Pro - 4">
        <div className="absolute contents left-[38px] top-[134px]">
          <MaskGroupImage />
          <p className="-translate-x-1/2 absolute font-['Spectral:Medium_Italic',sans-serif] italic leading-[0] left-[201px] lowercase text-[16.786px] text-center text-white top-[280px] tracking-[3.3572px] w-[284.433px]">
            <span className="capitalize leading-[1.35]">exclusive</span>
            <span className="leading-[1.35]">{` invitation FOR `}</span>
            <span className="capitalize leading-[1.35]">John Doe</span>
          </p>
          <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal h-[51px] leading-[1.25] left-[201px] not-italic text-[14.133px] text-center text-white top-[348px] w-[240px]">You’re invited to an exclusive invitation-only murder mystery event called Shot In The Dark.</p>
          <div className="absolute h-[41px] left-[75px] rounded-[20px] top-[556px] w-[252px]" data-name="Button">
            <div className="absolute bg-white inset-0 rounded-[20px]" />
            <p className="absolute font-['JLR_Emeric:SemiBold',sans-serif] inset-[34.15%_37.74%_31.71%_37.74%] leading-[1.141] not-italic text-[#313131] text-[12px] text-center tracking-[1.8px] whitespace-nowrap">OPEN INVITATION</p>
          </div>
          <div className="absolute h-[81.764px] left-[185px] top-[436px] w-[32.085px]" data-name="Arrow">
            <div className="absolute flex inset-0 items-center justify-center">
              <div className="-rotate-90 flex-none h-[32.084px] w-[81.764px]">
                <div className="border-[0.776px] border-solid border-white rounded-[64.901px] size-full" />
              </div>
            </div>
            <div className="absolute flex inset-[16.27%_37.69%_43.72%_39.66%] items-center justify-center">
              <div className="flex-none h-[7.27px] rotate-90 w-[32.716px]">
                <div className="relative size-full">
                  <div className="absolute inset-[-3.69%_-1.65%_-3.75%_0]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33.2564 7.81069">
                      <path d={svgPaths.p13c6d300} id="Vector 19" stroke="var(--stroke-0, white)" strokeWidth="0.776238" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Text text="A colour" />
        <Text1 text="A photo of your dog?" />
        <div className="absolute contents left-[103px] top-[763px]">
          <div className="absolute bg-[#383838] content-stretch flex items-center left-[168px] px-[22px] py-[16.077px] rounded-[33px] size-[66px] top-[767px]">
            <Helper />
          </div>
          <Helper1 additionalClassNames="top-[778px]" />
          <Helper2 additionalClassNames="top-[778px]" />
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Spectral:Regular',sans-serif] justify-center leading-[0] left-[197px] not-italic text-[24px] text-center text-white top-[90px] w-[352px]">
          <p className="leading-none">Like it?</p>
        </div>
      </div>
      <div className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[73.92%_22.82%_19.47%_70.16%] leading-none not-italic text-[9px] text-center text-white whitespace-pre-wrap">
        <p className="mb-0">You are cordially invited to the very first AI-hosted murder mystery.</p>
        <p className="mb-0">&nbsp;</p>
        <Helper5 />
        <p className="mb-0">&nbsp;</p>
        <p className="mb-0">{`Your AI host knows who; but they're not telling. `}</p>
        <p className="mb-0">&nbsp;</p>
        <p className="mb-0">Not yet.</p>
        <p className="mb-0">&nbsp;</p>
        <p>{`Dress sharp. Trust no one. And whatever you do, don't leave your drink unattended.`}</p>
      </div>
      <div className="-translate-y-1/2 absolute bg-black border-4 border-solid border-white h-[874px] left-[133px] overflow-clip rounded-[25px] top-[calc(50%-417px)] w-[402px]" data-name="iPhone 16 & 17 Pro - 5">
        <Text text="A colour" />
        <Text1 text="A photo of your dog?" />
        <div className="absolute contents left-[103px] top-[763px]">
          <div className="absolute bg-[#383838] content-stretch flex items-center left-[168px] px-[22px] py-[16.077px] rounded-[33px] size-[66px] top-[767px]">
            <Helper />
          </div>
          <Helper1 additionalClassNames="top-[778px]" />
          <Helper2 additionalClassNames="top-[778px]" />
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Spectral:Regular',sans-serif] justify-center leading-[0] left-[197px] not-italic text-[24px] text-center text-white top-[433px] w-[352px]">
          <p className="leading-none">Perfect.</p>
        </div>
      </div>
      <div className="-translate-y-1/2 absolute bg-black border-4 border-solid border-white h-[874px] left-[583px] overflow-clip rounded-[25px] top-[calc(50%-417px)] w-[402px]" data-name="iPhone 16 & 17 Pro - 6">
        <Text text="A colour" />
        <Text1 text="A photo of your dog?" />
        <div className="absolute contents left-[103px] top-[763px]">
          <div className="absolute bg-[#383838] content-stretch flex items-center left-[168px] px-[22px] py-[16.077px] rounded-[33px] size-[66px] top-[767px]">
            <Helper />
          </div>
          <Helper1 additionalClassNames="top-[778px]" />
          <Helper2 additionalClassNames="top-[778px]" />
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Spectral:Regular',sans-serif] justify-center leading-[1.25] left-[197px] not-italic text-[24px] text-center text-white top-[433px] w-[352px]">
          <p className="mb-0">{`Here's a preview of the invite;`}</p>
          <p>{`each one gets their character profile. `}</p>
        </div>
      </div>
      <div className="-translate-y-1/2 absolute bg-black border-4 border-solid border-white h-[874px] left-[2375px] overflow-clip rounded-[25px] top-[calc(50%-417px)] w-[402px]" data-name="iPhone 16 & 17 Pro - 1">
        <Text text="A colour" />
        <Text1 text="A photo of your dog?" />
        <div className="absolute content-stretch flex flex-col items-center left-[25px] top-[140px] w-[343px]" data-name="Title">
          <p className="font-['Spectral:SemiBold_Italic',sans-serif] italic leading-none relative shrink-0 text-[24px] text-center text-white tracking-[-0.48px] w-full">Good... Now type in their emails and i’ll take care of the rest.</p>
        </div>
        <div className="absolute contents left-[29px] top-[306px]">
          <div className="absolute content-stretch flex flex-col gap-[12px] items-start left-[33px] rounded-[100px] top-[310px] w-[335px]" data-name="field Phone">
            <div className="content-stretch flex gap-px h-[25px] items-start relative shrink-0">
              <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.1] not-italic relative shrink-0 text-[24px] text-center text-white tracking-[-0.48px] whitespace-nowrap">john.doe@gmail.com</p>
            </div>
            <div className="bg-[rgba(255,255,255,0.3)] h-px shrink-0 w-full" data-name="—" />
          </div>
          <div className="absolute content-stretch flex flex-col gap-[12px] items-start left-[34px] rounded-[100px] top-[367px] w-[335px]" data-name="field Phone">
            <div className="content-stretch flex gap-px h-[25px] items-start relative shrink-0">
              <div className="flex h-[25px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
                <div className="flex-none rotate-90">
                  <div className="h-0 relative w-[25px]">
                    <div className="absolute inset-[-1px_0_0_0]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 1">
                        <line id="Line 40" stroke="var(--stroke-0, white)" x2="25" y1="0.5" y2="0.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.1] not-italic opacity-20 relative shrink-0 text-[24px] text-center text-white tracking-[-0.48px] whitespace-nowrap">Guest 2</p>
            </div>
            <div className="bg-[rgba(255,255,255,0.3)] h-px shrink-0 w-full" data-name="—" />
          </div>
          <div className="absolute content-stretch flex flex-col gap-[12px] items-start left-[35px] rounded-[100px] top-[424px] w-[335px]" data-name="field Phone">
            <Text2 text="Guest 3" />
            <div className="bg-[rgba(255,255,255,0.3)] h-px shrink-0 w-full" data-name="—" />
          </div>
          <div className="absolute content-stretch flex flex-col gap-[12px] items-start left-[36px] rounded-[100px] top-[481px] w-[335px]" data-name="field Phone">
            <Text2 text="Guest 4" />
            <div className="bg-[rgba(255,255,255,0.3)] h-px shrink-0 w-full" data-name="—" />
          </div>
          <div className="absolute content-stretch flex flex-col gap-[12px] items-start left-[37px] rounded-[100px] top-[538px] w-[335px]" data-name="field Phone">
            <Text2 text="Guest 5" />
            <div className="bg-[rgba(255,255,255,0.3)] h-px shrink-0 w-full" data-name="—" />
          </div>
          <div className="absolute content-stretch flex flex-col gap-[12px] items-start left-[38px] rounded-[100px] top-[595px] w-[334px]" data-name="field Phone">
            <Text2 text="Guest 6" />
            <div className="bg-[rgba(255,255,255,0.3)] h-px shrink-0 w-full" data-name="—" />
          </div>
        </div>
        <div className="-translate-x-1/2 absolute bg-white bottom-[135px] content-stretch flex flex-col h-[50px] items-center justify-center left-[calc(50%+4.5px)] opacity-20 px-[32px] py-[24px] rounded-[62px] shadow-[0px_10px_34px_0px_rgba(0,0,0,0.25)] w-[335px]">
          <div className="flex flex-col font-['Helvetica_Neue_LT_Pro:55_Roman',sans-serif] justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center whitespace-nowrap">
            <p className="leading-[1.5]">Continue</p>
          </div>
        </div>
        <div className="absolute contents left-[103px] top-[767px]">
          <div className="absolute bg-[#383838] content-stretch flex items-center left-[168px] px-[22px] py-[16.077px] rounded-[33px] size-[66px] top-[771px]">
            <Helper />
          </div>
          <Helper1 additionalClassNames="top-[782px]" />
          <Helper2 additionalClassNames="top-[782px]" />
        </div>
      </div>
      <div className="-translate-y-1/2 absolute bg-black border-4 border-solid border-white h-[874px] left-[1493px] overflow-clip rounded-[25px] top-[calc(50%-417px)] w-[402px]" data-name="iPhone 16 & 17 Pro - 7">
        <Helper3 text="1920’s Great Gatsby" text1="26th Feb 2026 @ 7pm" text2="&nbsp;" text3="I WILL BE ATTENDING" text4="I HAVE TO DECLINE" />
        <Text text="A colour" />
        <Text1 text="A photo of your dog?" />
        <div className="absolute contents left-[103px] top-[763px]">
          <div className="absolute bg-[#383838] content-stretch flex items-center left-[168px] px-[22px] py-[16.077px] rounded-[33px] size-[66px] top-[767px]">
            <Helper />
          </div>
          <Helper1 additionalClassNames="top-[778px]" />
          <Helper2 additionalClassNames="top-[778px]" />
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Spectral:Regular',sans-serif] justify-center leading-[0] left-[197px] not-italic text-[24px] text-center text-white top-[90px] w-[352px]">
          <p className="leading-none">Like it?</p>
        </div>
        <Helper4 text="&nbsp;" text1="&nbsp;" />
      </div>
      <div className="-translate-y-1/2 absolute bg-black border-4 border-solid border-white h-[874px] left-[1934px] overflow-clip rounded-[25px] top-[calc(50%-417px)] w-[402px]" data-name="iPhone 16 & 17 Pro - 8">
        <Helper3 text="1920’s Great Gatsby" text1="26th Feb 2026 @ 7pm" text2="&nbsp;" text3="I WILL BE ATTENDING" text4="I HAVE TO DECLINE" />
        <Text text="A colour" />
        <Text1 text="A photo of your dog?" />
        <div className="absolute contents left-[103px] top-[763px]">
          <div className="absolute bg-[#383838] content-stretch flex items-center left-[168px] px-[22px] py-[16.077px] rounded-[33px] size-[66px] top-[767px]">
            <Helper />
          </div>
          <Helper1 additionalClassNames="top-[778px]" />
          <Helper2 additionalClassNames="top-[778px]" />
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Spectral:Regular',sans-serif] justify-center leading-[0] left-[197px] not-italic text-[24px] text-center text-white top-[90px] w-[352px]">
          <p className="leading-none">Like it?</p>
        </div>
        <div className="absolute bg-[rgba(255,255,255,0.1)] content-stretch flex items-center justify-center left-[20px] p-[16px] rounded-[10px] top-[688px] w-[352px]">
          <div aria-hidden="true" className="absolute border border-[#838383] border-solid inset-0 pointer-events-none rounded-[10px]" />
          <p className="flex-[1_0_0] font-['Source_Sans_Pro:Regular',sans-serif] leading-[1.5] min-h-px min-w-px not-italic relative text-[16px] text-center text-white">Yeah, looks great. Lets send them!</p>
        </div>
        <Helper4 text="&nbsp;" text1="&nbsp;" />
      </div>
    </div>
  );
}