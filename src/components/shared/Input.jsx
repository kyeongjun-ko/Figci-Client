import styled from "styled-components";

function Input({ inputInfo, onInputChange }) {
  return (
    <InputWrapper>
      <label htmlFor={inputInfo.id} className="label">
        {inputInfo.label}
      </label>
      {inputInfo.inputs.map(input => (
        <input
          key={input.id}
          id={input.id}
          placeholder={input.placeholder}
          onChange={onInputChange}
        />
      ))}
      {inputInfo.description && (
        <span className="description">{inputInfo.description}</span>
      )}
    </InputWrapper>
  );
}

const InputWrapper = styled.div`
  box-sizing: border-box;
  padding-top: 48px;

  input {
    width: 560px;
    height: 64px;
    margin-bottom: 12px;
    padding: 0px 24px;
    display: flex;

    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
    border-radius: 8px;
    border: 2px solid #000000;
    background-color: #ffffff;
  }

  .label {
    display: block;
    margin-bottom: 12px;

    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
  }

  .description {
    display: block;

    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    color: #868e96;
  }
`;

export default Input;
