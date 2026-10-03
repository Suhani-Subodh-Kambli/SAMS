import React from 'react';

const StatusBadge = ({ status }) => {
  let bgColor = '#e2e8f0';
  let color = '#718096';
  let text = 'Unknown';
  let icon = '●';

  if (status === 'VERIFIED') {
    bgColor = '#e6f4ea';
    color = 'var(--color-primary)';
    text = 'Verified';
    icon = '✓';
  } else if (status === 'PENDING') {
    bgColor = '#fef3c7';
    color = '#d97706';
    text = 'Pending';
    icon = '●';
  } else if (status === 'REJECTED') {
    bgColor = '#fee2e2';
    color = 'var(--color-danger)';
    text = 'Rejected';
    icon = '×';
  }

  return (
    <span style={{
      backgroundColor: bgColor,
      color: color,
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    }}>
      <span>{icon}</span> {text}
    </span>
  );
};

export default StatusBadge;
