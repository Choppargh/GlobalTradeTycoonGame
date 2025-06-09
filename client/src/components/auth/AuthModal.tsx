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
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogOverlay className="bg-black/50" />
        <DialogContent className="max-w-md mx-auto">
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
        </DialogContent>
      </Dialog>
    );
  }
}