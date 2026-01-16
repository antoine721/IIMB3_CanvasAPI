type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';

export const getTransitionClass = (transitionState: TransitionState): string => {
  switch (transitionState) {
    case 'entering':
      return 'section-entering';
    case 'entered':
      return 'section-entered';
    case 'exiting':
      return 'section-exiting';
    case 'exited':
      return 'section-exited';
    default:
      return '';
  }
};

export const getContentTransitionClass = (transitionState: TransitionState): string => {
  switch (transitionState) {
    case 'entering':
      return 'content-entering';
    case 'entered':
      return 'content-entered';
    case 'exiting':
      return 'content-exiting';
    case 'exited':
      return 'content-exited';
    default:
      return '';
  }
};
