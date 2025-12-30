import React from 'react';

type DropdownItemProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  onClick: () => void;
};

export const DropdownItem = ({ icon, title, description, onClick }: DropdownItemProps) => {
  return (
    <div
      onClick={onClick}
      className="w-full min-h-[50px] flex items-center gap-3 p-2 rounded-[12px]
                 cursor-pointer transition-colors hover:bg-[#F1F3E0]"
    >
      {icon && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-lg overflow-hidden">
          {icon}
        </div>
      )}

      <div className="flex flex-col justify-center">
        <span className="text-[16px] font-medium text-gray-900 leading-tight">{title}</span>
        {description && (
          <span className="text-[14px] text-gray-500 mt-0.5 leading-tight truncate w-[180px]">
            {description}
          </span>
        )}
      </div>
    </div>
  );
};
