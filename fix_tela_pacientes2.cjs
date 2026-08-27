const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// I will just use sed to replace the if (modoForm) block. 
// Or string replacement in JS.

app = app.replace(/if \(modoForm\) \{[\s\S]*?<\/form>\s*<\/div>\s*<\/div>\s*\)\s*\}/, `if (modoForm) {
    return <NovoPacienteForm fechar={() => setModoForm(false)} carregarPacientes={() => {
      carregarPacientes();
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 4000);
    }} />
  }`);

// Remove the unused state variables in TelaPacientes
app = app.replace(/const \[nome, setNome\] = useState\(''\)\n/, '');
app = app.replace(/const \[dataNascimento, setDataNascimento\] = useState\(''\)\n/, '');
app = app.replace(/const \[telefone, setTelefone\] = useState\(''\)\n/, '');
app = app.replace(/const \[email, setEmail\] = useState\(''\)\n/, '');

// Remove the criarPacienteRapido function since it's in NovoPacienteForm now
app = app.replace(/const criarPacienteRapido = async \(e: React\.FormEvent\) => \{[\s\S]*?setTimeout\(\(\) => setToastVisible\(false\), 4000\)\n  \}/, '');

// Fix the "Novo Paciente" button onClick
app = app.replace(/onClick=\{\(\) => \{\s*setNome\(''\)\s*setDataNascimento\(''\)\s*setTelefone\(''\)\s*setModoForm\(true\)\s*\}\}/, 'onClick={() => setModoForm(true)}');

fs.writeFileSync('src/App.tsx', app);
