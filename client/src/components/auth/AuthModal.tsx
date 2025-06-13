import React from 'react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

interface AuthModalState {
  mode: 'login' | 'register';
}

export class AuthModal extends React.Component<AuthModalProps, AuthModalState> {
  constructor(props: AuthModalProps) {
    super(props);
    this.state = {
      mode: props.defaultMode || 'login'
    };
  }

  handleToggleMode = () => {
    this.setState(prev => ({
      mode: prev.mode === 'login' ? 'register' : 'login'
    }));
  };

  handleSuccess = () => {
    this.props.onClose();
    // Refresh page to update authentication state
    window.location.reload();
  };

  render() {
    const { isOpen, onClose } = this.props;
    const { mode } = this.state;

    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogOverlay className="bg-black/50" />
        <div className="fixed left-[50%] top-[50%] z-[101] grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          {mode === 'login' ? (
            <LoginForm 
              onToggleMode={this.handleToggleMode}
              onSuccess={this.handleSuccess}
            />
          ) : (
            <RegisterForm 
              onToggleMode={this.handleToggleMode}
              onSuccess={this.handleSuccess}
            />
          )}
        </div>
      </Dialog>
    );
  }
}