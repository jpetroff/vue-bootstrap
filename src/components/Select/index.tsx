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

// Hook
function useOnClickOutside(ref : RefObject<HTMLDivElement>, handler : (event? : Event) => void) {
	useEffect(
		() => {
			const listener : (event: Event) => void = function(event) {
				// Do nothing if clicking ref's element or descendent elements
				if (!ref.current || ref.current.contains(event.target as Node)) {
					return;
				}

				handler(event);
			};

			window.addEventListener('mousedown', listener);
			window.addEventListener('touchstart', listener);

			return () => {
				document.removeEventListener('mousedown', listener);
				document.removeEventListener('touchstart', listener);
			};
		},
		// Add ref and handler to effect dependencies
		// It's worth noting that because passed in handler is a new ...
		// ... function on every render that will cause this effect ...
		// ... callback/cleanup to run every render. It's not a big deal ...
		// ... but to optimize you can wrap handler in useCallback before ...
		// ... passing it into this hook.
		[ref, handler]
	);
}

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

	onChange? : ( newValue : string | string[] ) => void,

}

export var Select : FunctionComponent<SelectProps> = function(props) {
	const [active, setActive] = useState<boolean>(false);

	const inputRef = useRef();

	useOnClickOutside(inputRef, () => {
		setActive(false);
	});

	function onChange(val : string | string[]) {
		props.onChange && props.onChange(val);
	}

	return (
		<div>
			{props.label && <InputLabel>{props.label}</InputLabel>}
			<InputWrapper ref={inputRef} onClick={() => setActive(!active)}>
				<ValueWrapper>
					{_.isEmpty(props.value) ? 
						props.placeholder : 
						<div>{props.value}</div>
					}
				</ValueWrapper>
				<CaretWrapper className={classNames({'active': active})}>
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

