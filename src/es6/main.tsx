import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Select, SelectOptionType } from '../components/Select/index';
import styled from 'styled-components';
import { Popover } from '../components/Select/popover';

const Wrapper = styled.div`
		width: 460px;
		padding: 24px;
		box-sizing: border-box;
		margin: auto;
		margin-top: 64px; 
		position: relative;
	`;

const appOptions = [
	{value: '1', text: 'option 1'},
	{value: '2', text: 'option 2'},
	{value: '3', text: 'option 3'},
	{value: '4', text: 'option 4'},
	{value: '5', text: 'option 5'},
	{value: '6', text: 'option 6'},
	{value: '7', text: 'option 7'},
	{value: '8', text: 'option 8'},
]

function App() {
	const [selectFirst, setSelectFirst] = useState<string | string[]>(null);
	const [selectSecond, setSelectSecond] = useState<string | string[]>([]);
	
	return (
		<Wrapper>
			<Select
				label="First"
				value={selectFirst}
				options={appOptions}
				onChange={(val) => setSelectFirst(val)} />
			<Select multi
				label="Second"
				value={selectSecond}
				options={appOptions}
				onChange={(val) => setSelectSecond(val)} />
		</Wrapper> 
	);
}

ReactDOM.render(
	<App />,
	document.getElementById('app')
);