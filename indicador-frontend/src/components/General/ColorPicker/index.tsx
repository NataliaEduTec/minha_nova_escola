import { useState } from 'react';
import { ChromePicker } from 'react-color';
import Input from "../../Elements/Input";

type PropsColorPicker = {
    color: string
    setColor: (color: string) => void
}

export const defaultColorPicker = '#ff0000'

export default function ColorPicker({color, setColor}: PropsColorPicker) {
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const handleChange = (color: { hex: string }) => {
        setColor(color.hex);
    };

    const togglePicker = () => {
        setIsPickerOpen(!isPickerOpen);
    };

    return (
        <div className="flex flex-col items-center">
            <section className={`flex w-full`}>
                <Input
                    type="text"
                    id="cor"
                    placeholder={`Ex: #ffffff`}
                    name="name"
                    value={color}
                    maxLength={7}
                    onChange={(e) => setColor(e.target.value)}
                    className="input w-full input-bordered border-r-0 rounded-r-none"
                />
                <div
                    onClick={togglePicker}
                    className="w-12 h-12  cursor-pointer border-2 border-gray-3000 rounded-r-lg"
                    style={{backgroundColor: color}}
                ></div>
            </section>

            {isPickerOpen && (
                <div className="mt-4 relative z-10">
                    <ChromePicker color={color} disableAlpha={true} onChange={handleChange}/>
                </div>
            )}
        </div>
    );
}
