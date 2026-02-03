function ShellHeader() {
    return (
        <header className="shell-header">
            <div className="shell-header__inner">
                <span className="shell-header__badge">
                    IA • Code Review • Clean Architecture
                </span>
                <h1 className="shell-header__title">AI Code Reviewer</h1>
                <p className="shell-header__subtitle">
                    Cole o diff do PR ou o código e deixe a IA encontrar pontos fortes,
                    riscos e oportunidades de refatoração.
                </p>
            </div>
        </header>
    );
}

export { ShellHeader };
export default ShellHeader;
