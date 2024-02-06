import styled from "styled-components";

function Select({ selectInfo, onInputChange }) {
  return (
    <SelectWrapper>
      <label htmlFor={selectInfo.id}>{selectInfo.label}</label>
      {selectInfo.selects.map(select => (
        <select key={select.id} id={select.id} onChange={onInputChange}>
          {select.options.map(option => (
            <option
              key={option.value}
              value={option.value}
              defaultValue={option.defaultValue}
            >
              {option.value}
            </option>
          ))}
        </select>
      ))}
      {selectInfo.description && (
        <span className="description">{selectInfo.description}</span>
      )}
    </SelectWrapper>
  );
}

const SelectWrapper = styled.div`
  box-sizing: border-box;
  padding-top: 48px;

  select {
    width: 400px;
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

export default Select;
