import { TextInput } from 'react-native'
import styled, { css } from 'styled-components/native'

export const Container = styled(TextInput)`
  ${({ theme }) => css`
    font-size: ${theme.FONT_SIZE.MD}px;
    font-family: ${theme.FONT_FAMILY.REGULAR};
    color: ${theme.COLORS.WHITE};
    background-color: ${theme.COLORS.GRAY_700};
  `}

  flex: 1;
  min-height: 56px;
  max-height: 56px;
  border-radius: 6px;
  padding: 16px;
`
