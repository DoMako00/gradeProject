import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { ScreenContainer, Input, Button } from '../../../components/ui';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase';
import { theme } from '../../../theme';
import type { UserStackScreenProps } from '../../../types/navigation';

const c = theme.colors.cartoon;

type Props = UserStackScreenProps<'AddVehicle'>;

export function AddVehicleScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!user?.id) return;
    const yearNum = parseInt(year, 10);
    if (!make.trim() || !model.trim() || isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
      setError('Please enter valid make, model, and year.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const { error: insertError } = await supabase.from('user_vehicles').insert({
        user_id: user.id,
        make: make.trim(),
        model: model.trim(),
        year: yearNum,
        license_plate: licensePlate.trim() || null,
      });
      if (insertError) throw insertError;
      navigation.goBack();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to add vehicle');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer style={styles.screen} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Input
            label="Make"
            value={make}
            onChangeText={setMake}
            placeholder="e.g. Toyota"
          />
          <Input
            label="Model"
            value={model}
            onChangeText={setModel}
            placeholder="e.g. Camry"
          />
          <Input
            label="Year"
            value={year}
            onChangeText={setYear}
            placeholder="e.g. 2021"
            keyboardType="number-pad"
          />
          <Input
            label="License Plate (optional)"
            value={licensePlate}
            onChangeText={setLicensePlate}
            placeholder="e.g. 4XYZ123"
            autoCapitalize="characters"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <View style={styles.buttonRow}>
            <Button
              title="Add Vehicle"
              onPress={handleSave}
              loading={saving}
              disabled={saving}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: c.cream,
  },
  keyboard: {
    flex: 1,
  },
  scroll: {
    padding: theme.spacing.lg,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
  },
  buttonRow: {
    marginTop: theme.spacing.md,
  },
  saveButton: {
    backgroundColor: c.red,
  },
});
