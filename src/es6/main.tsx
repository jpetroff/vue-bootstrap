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
]

function App() {
	const [selectValue, setSelectValue] = useState<string | string[]>('');

	function handleInput(value : string | string[]) {
		console.log(value);
		setSelectValue(value);
	}
	
	return (
		<Wrapper>
			<Select label="Test fdfs" value={selectValue} options={appOptions} onChange={handleInput}>
			</Select>
		</Wrapper> 
	);
}

ReactDOM.render(
	<App />,
	document.getElementById('app')
);