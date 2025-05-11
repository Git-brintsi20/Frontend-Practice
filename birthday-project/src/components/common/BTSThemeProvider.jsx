import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BTS_MEMBERS } from '../../utils/constants';

const BTSThemeProvider = ({ member = 'default', children, className = '' }) => {
  const { changeThemeNew } = useTheme();
  
  React.useEffect(() => {
    if (member && BTS_MEMBERS[member]) {
      changeThemeNew(member); // Member should be 'default', 'jungkook', or 'jin'
    }
  }, [member, changeThemeNew]);
  
  return (
    <div className={`bts-themed bts-${member} ${className}`}>
      {children}
    </div>
  );
};

export default BTSThemeProvider;