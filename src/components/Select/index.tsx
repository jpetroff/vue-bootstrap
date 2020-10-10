import
React, 
{ 
	useState,
	useEffect,
	useRef,
	FunctionComponent,
	RefObject,
	MouseEvent
} from 'react';
import {
	InputWrapper,
	InputLabel,
	ValueWrapper,
	CaretWrapper,
	CaretDown
} from './styles';
import _ from 'underscore';
import { Popover } from './popover';
import classNames from 'classnames';
import { useOnClickOutside } from '../Utils/index';


export type SelectOptionType = {
	value: string,
	text: string,
	description? : string,
	icon? : string,
	thumbnail? : string
}

export type SelectProps = {
	multi? : boolean,
	value : string | string[],
	options: SelectOptionType[],

	label? : string,
	placeholder? : string,
	searchPlaceholder? : string,
	emptySearch? : string,
	emptyOptions? : string,

	onChange? : ( newValue : string | string[], doClose? : boolean ) => void,

}

export var Select : FunctionComponent<SelectProps> = function(props) {
	const [active, setActive] = useState<boolean>(false);

	const inputRef = useRef();

	useOnClickOutside(inputRef, () => {
		setActive(false);
	});

	function onChange(val : string | string[], doClose? : boolean) {
		props.onChange && props.onChange(val);
		if(doClose) setActive(false);
	}

	return (
		<div className={classNames('select', {'active': active})}>
			{props.label && <InputLabel>{props.label}</InputLabel>}
			<InputWrapper ref={inputRef} onClick={() => setActive(!active)}>
				<ValueWrapper>
					{_.isEmpty(props.value) ? 
						props.placeholder : 
						<div>{props.value}</div>
					}
				</ValueWrapper>
				<CaretWrapper>
					<CaretDown />
				</CaretWrapper>
				<Popover onChange={onChange} multi={props.multi} show={active} options={props.options} value={props.value} />
			</InputWrapper>
		</div>
	);
}


Select.displayName = 'Select';
Select.defaultProps = {
	value: null,
	multi: false,
	options: [],
	placeholder: 'Select value',
	searchPlaceholder: 'Search value',
	emptyOptions: 'No options available',
	emptySearch: 'No options available'
};

