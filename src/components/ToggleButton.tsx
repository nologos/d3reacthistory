import React from "react";

interface Props {
    handleToggle: () => void;
    buttonState: boolean;
}


const ToggleButton: React.FC<Props> = ({ handleToggle, buttonState }) => {
    return (
        <div className="relative flex items-center">
            <label className="flex items-center cursor-pointer">
                <div className="relative">
                    <input
                        type="checkbox"
                        className="sr-only"
                        onChange={handleToggle}
                        checked={buttonState}
                    />
                    <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                    <div
                        className={`absolute left-0 top-0 w-6 h-6 rounded-full transition-transform transform ${buttonState ? 'translate-x-full bg-green-500' : 'translate-x-0 bg-gray-400'
                            }`}
                    ></div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">
                    {buttonState ? true : false}
                </span>
            </label>
        </div>
    );
};




export default ToggleButton
