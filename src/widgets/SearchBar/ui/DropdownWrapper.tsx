type DropdownWrapperProps = {
  title?: string;
  children: React.ReactNode;
};

export const DropdownWrapper = ({ title, children }: DropdownWrapperProps) => {
  return (
    <div
      className="absolute top-[70px] left-[-20px] w-[300px] max-h-[300px]
                 bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.15)]
                 border border-gray-100 overflow-hidden z-50 flex flex-col py-5"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-5 mb-2 text-[14px] font-bold text-gray-800">{title}</div>
      <div className="overflow-y-auto px-5 flex flex-col gap-1 custom-scrollbar">{children}</div>
    </div>
  );
};
