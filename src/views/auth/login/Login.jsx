// project-imoports
import AuthLoginForm from 'sections/auth/AuthLogin';

// ===========================|| AUTH - LOGIN V1 ||=========================== //

export default function LoginPage() {
  return (
    <div className="auth-main">
      <div className="auth-wrapper v1">
        <div className="auth-form">
          <div className="position-relative">
            <div className="auth-bg">
             
            </div>
            <AuthLoginForm link="/register" />
          </div>
        </div>
      </div>
    </div>
  );
}
