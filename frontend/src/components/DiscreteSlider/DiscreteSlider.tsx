import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

function valuetext(value: number) {
	return `Level ${value}`;
}

// const marks = Array.from({ length: 20 }, (_, index) => ({
// 	value: index + 1,
// 	label: String(index + 1),
// }));

type DiscreteSliderProps = {
	value: number;
	onChange: (value: number) => void;
};

export function DiscreteSlider({ value, onChange }: DiscreteSliderProps) {
	return (
		<div className="pt-2 w-full flex justify-center">
			<Box sx={{ width: 500 }}>
				<Slider
					aria-label="AI level"
					value={value}
					onChange={(_, newValue) => onChange(newValue as number)}
					getAriaValueText={valuetext}
					valueLabelDisplay="auto"
					step={1}
					min={1}
					max={20}
					sx={{
						color: "#6aa349",
						"& .MuiSlider-markLabel": {
							color: "#ffffff",
						},
						// "& .MuiSlider-valueLabel": {
						// 	color: "#ffffff",
						// },
					}}
				/>
				<p className="pt-1 text-center text-sm font-semibold text-button-green">Selected level: [ <span className="text-white">{value}</span> ] </p>
			</Box>
		</div>
	);
}
