// src/components/common/BTSThemeProvider.jsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BTS_MEMBERS } from '../../utils/constants';

/**
 * A wrapper component that applies BTS member-specific styling
 * @param {Object} props - Component props
 * @param {string} props.member - BTS member name (e.g., 'jungkook', 'jin')
 * @param {React.ReactNode} props.children - Child components
 * @param {string} [props.className] - Additional CSS class names
 */
const BTSThemeProvider = ({ member, children, className = '' }) => {
  const { changeThemeNew } = useTheme();
  
  // Change theme when member prop changes
  React.useEffect(() => {
    if (member && BTS_MEMBERS[member]) {
      changeThemeNew(member);
    }
  }, [member, changeThemeNew]);
  
  return (
    <div className={`bts-themed bts-${member} ${className}`}>
      {children}
    </div>
  );
};

export default BTSThemeProvider;