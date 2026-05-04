const Input = ({
  setFunc,
  nameValue,
  type,
}: {
  setFunc: (value: any) => void;
  nameValue: string;
  type?: string;
}) => {
  return (
    <div className="mt-4">
      <label htmlFor={nameValue} className="relative">
        <input
          type={type}
          id={nameValue}
          placeholder=""
          onChange={(e) => setFunc(e.target.value)}
          className="peer w-full shadow-sm p-2 sm:text-sm border border-white
              bg-[#191918] text-white rounded-xl font-medium"
        />
        <span
          className="absolute inset-y-0 start-3-translate-y-5 px-0.5 text-sm
              font-medium transition-transform peer-placeholder-shown:translate-y-0.5
              peer-focus:-translate-y-5 bg-[#191918] flex ml-3 "
        >
          {nameValue}
        </span>
      </label>
    </div>
  );
};

export default Input;
