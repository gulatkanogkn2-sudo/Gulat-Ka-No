import React from 'react';
import { OwnerSettings } from '../../../../types/systemSettings';
import { AdministratorsAndRolesTab } from './AdministratorsAndRolesTab';

export interface OwnerSettingsTabProps {
  settings: OwnerSettings;
  onChange: (updated: OwnerSettings) => void;
}

export const OwnerSettingsTab: React.FC<OwnerSettingsTabProps> = ({ settings, onChange }) => {
  return <AdministratorsAndRolesTab settings={settings} onChange={onChange} />;
};
