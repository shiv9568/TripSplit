import Joyride, { type Step, type CallBackProps, STATUS } from 'react-joyride';
import { useState } from 'react';

interface OnboardingProps {
  run: boolean;
  onFinish: () => void;
}

export default function Onboarding({ run, onFinish }: OnboardingProps) {
  const [steps] = useState<Step[]>([
    {
      target: '.tour-create-trip',
      content: 'Start by creating your first trip here! Give it a name and invite your friends.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '.tour-add-expense',
      content: 'Once you have a trip, use this button to add any expense - from group dinners to petrol.',
      placement: 'top',
    },
    {
      target: '.tour-reports',
      content: 'Check the Analytics tab to see beautiful charts of your spending habits!',
      placement: 'top',
    },
    {
      target: '.tour-settle',
      content: 'When the trip is over, this is where magic happens! We calculate exactly who owes whom.',
      placement: 'top',
    }
  ]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      onFinish();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#0d9488', // teal-600
          zIndex: 1000,
        },
        buttonNext: {
            borderRadius: '12px',
            fontWeight: '900',
            fontSize: '12px',
            textTransform: 'uppercase',
            padding: '12px 20px',
        },
        buttonBack: {
            fontSize: '12px',
            fontWeight: '700',
            marginRight: '10px',
        },
        tooltipContainer: {
            borderRadius: '24px',
            textAlign: 'left',
            padding: '10px',
        },
        tooltipTitle: {
            fontWeight: '900',
            fontSize: '18px',
        },
        tooltipContent: {
            fontSize: '14px',
            fontWeight: '600',
        }
      }}
    />
  );
}
