import { createContext } from 'react';

import { AuthContextValue } from '../types';

/** 인증 관련 컨텍스트 생성 */
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
