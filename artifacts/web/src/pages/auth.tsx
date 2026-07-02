import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from 'wouter';
import { MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      setLocation('/rooms');
    } catch (err) {
      setError('Giriş başarısız. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight uppercase text-white">Tartışmanya</h1>
          <p className="text-muted-foreground mt-2 text-center text-sm">
            Türkiye'nin tartışma arenasına hoş geldin. Tarafını seç, fikrini savun.
          </p>
        </div>

        <div className="flex bg-muted rounded-lg p-1 mb-6">
          <button
            data-testid="tab-login"
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${isLogin ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setIsLogin(true)}
          >
            Giriş Yap
          </button>
          <button
            data-testid="tab-register"
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${!isLogin ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setIsLogin(false)}
          >
            Kayıt Ol
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kullanıcı Adı</label>
              <Input 
                data-testid="input-name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Örn: AslanBey"
                required={!isLogin}
                className="bg-background border-border h-12"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">E-posta</label>
            <Input 
              data-testid="input-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="E-posta adresin"
              required
              className="bg-background border-border h-12"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Şifre</label>
            <Input 
              data-testid="input-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-background border-border h-12"
            />
          </div>

          {error && <p className="text-destructive text-sm font-medium">{error}</p>}

          <Button data-testid="btn-submit" type="submit" className="w-full h-12 font-bold text-lg mt-2">
            {isLogin ? 'Arenaya Gir' : 'Hesap Oluştur'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">Demo erişimi için:</p>
          <p className="text-xs font-mono mt-1 text-primary">admin@tartismanya.com / herhangi şifre</p>
        </div>
      </div>
    </div>
  );
}
