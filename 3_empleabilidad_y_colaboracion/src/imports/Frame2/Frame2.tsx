export default function Frame() {
  return (
    <a className="bg-[#003082] cursor-pointer relative rounded-[20px] size-full" href="https://google.cl" target="_blank">
      <div className="content-stretch flex flex-col items-center justify-center overflow-clip p-[10px] relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[118px] justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-center text-white w-[355px]">
          <p className="leading-[20px]">General</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-5 border-solid border-white inset-0 pointer-events-none rounded-[20px]" />
    </a>
  );
}