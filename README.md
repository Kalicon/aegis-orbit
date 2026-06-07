# AEGIS-ORBIT — Android + Web Platform
## FIAP Global Solution 2026

<p align="center">
  <img src="assets/logo.png" alt="Aegis-Orbit Logo" width="180" />
</p>

<p align="center">
  <strong>Inteligência Climática por Satélite · Monitoramento Aeroespacial · Resposta a Desastres</strong><br>
  <em>Aplicativo Android Nativo + Dashboard Operacional Web (NASA EOS Partner)</em>
</p>

---

## 👨‍🚀 Equipe

| RM | Nome |
|---|---|
| **563172** | Kalicon Amorim da Cruz Souza |

**Curso:** Engenharia de Software — FIAP  
**Disciplina:** Global Solution 2026  
**Turma:** 1ESPH

---

## 🌍 Sobre o Projeto

O **Aegis-Orbit** é um sistema integrado de monitoramento climático e aeroespacial que combina:

- **Dashboard Operacional Web** estilo NASA Mission Control com dados em tempo real
- **Aplicativo Android Nativo** (Kotlin + Jetpack Compose + WebView) com uplink satelital NTN
- **APIs Reais Integradas**: NASA APOD, NASA NEO, ISS Tracker, SpaceX Launches, Open-Meteo, NOAA/SWPC
- **Módulo SkyWatch (UAP/SETI)**: Scanner ionosférico para detecção de anomalias aéreas
- **Eco-Créditos verdes** verificados por análise multiespectral óptica via satélite

---

## 🛰️ Funcionalidades

### Dashboard Principal (Sala de Telemetria)
- **Mapa EOS-HUD** com modos SAR Radar, Infravermelho TIRS, Óptico e SkyWatch
- **Hotspots interativos** de alerta (Rio-A: risco hidrológico, Norte-B: alerta térmico)
- **Rastreamento ISS em tempo real** via API pública
- **Monitor de Clima Espacial (NOAA/SWPC)**: vento solar, fluxo de prótons, atividade Kp
- **Hub Meteorológico Global**: temperatura, qualidade do ar, previsão 7 dias (Open-Meteo)
- **Alerta Defesa Civil SP**: simulação de nível de risco com sirenes de evasão

### Missão Aegis
- Infografia interativa da cadeia de valor espacial
- Diagrama animado dos satélites Sentinel/Landsat

### Simulador Android (Google Pixel)
- **Simulador completo** de smartphone com 5 telas funcionais:
  - Rotas de Fuga Offline (mapa SVG animado)
  - Reportar Ocorrência via uplink satelital LEO
  - Rastreamento de satélites LEO com alinhamento de antena
  - Aegis SkyWatch com radar giratório e blips de anomalia
  - Comunidade Verde (eco-créditos e gamificação)
- Terminal ADB emulado com comandos reais
- Loader de uplink satelital animado

### Observatório Espacial
- **NASA APOD** ao vivo com 4 modos de lente (H-Alpha, Gravitacional, Heliofísico)
- **SpaceX Launch Tracker** com countdown em tempo real
- **Fase da Lua** calculada localmente (canvas)
- **Asteroides NEO** (NASA JPL NeoWs API)
- **Decodificador SETI** com espectrograma de rádio animado
- Painel de avistamentos comunitários

### Apresentação Acadêmica (7 slides)
- Slides editáveis com dados do aluno
- Exportação em Markdown
- Slot para inserção do link YouTube do pitch

### ODS Alinhamento
- 5 Objetivos de Desenvolvimento Sustentável da ONU (9, 11, 13, 2, 8)

---

## 🏗️ Arquitetura

```
geopulse-ai/
├── index.html              # Dashboard Web principal (deploy direto)
├── css/
│   └── style.css           # Design system completo (dark mode, glassmorphism)
├── js/
│   └── main.js             # Toda a lógica: APIs, animações, interações
├── assets/
│   ├── logo.png            # Logo Aegis-Orbit
│   ├── background.png      # Background espacial
│   ├── telescope_obs.png   # Lente H-Alpha
│   ├── black_hole_obs.png  # Lente Gravitacional M87*
│   └── solar_flare_obs.png # Canal Heliofísico CME
└── android-app/            # Projeto Android Studio completo
    ├── settings.gradle.kts
    ├── build.gradle.kts
    └── app/
        ├── build.gradle.kts
        ├── proguard-rules.pro
        └── src/main/
            ├── AndroidManifest.xml
            ├── java/br/com/fiap/aegisorbit/
            │   └── MainActivity.kt   # WebView + Edge-to-Edge + Permissões
            ├── res/
            │   ├── values/
            │   │   ├── strings.xml
            │   │   └── themes.xml    # Tema escuro sem ActionBar
            │   └── drawable/
            └── assets/               # Cópia idêntica do web app
                ├── index.html
                ├── css/
                │   ├── style.css
                │   └── android.css   # Override mobile do layout desktop
                ├── js/
                │   └── main.js
                └── assets/           # Imagens
```

---

## 🚀 Como Usar

### Versão Web (Desktop)
1. Abra `index.html` diretamente no navegador, ou
2. Sirva com qualquer servidor HTTP local:
   ```bash
   cd geopulse-ai
   python3 -m http.server 8080
   # Acesse http://localhost:8080
   ```

### Versão Android
1. Abra a pasta `android-app/` no **Android Studio** (Arctic Fox ou superior)
2. Sincronize o Gradle: `File → Sync Project with Gradle Files`
3. Conecte um dispositivo Android (API 26+) ou crie um emulador
4. Pressione **Run** (`Shift+F10`)

> **Nota:** O app usa WebView para renderizar o mesmo HTML/CSS/JS da versão web, com CSS adicional (`android.css`) que adapta o layout para mobile.

---

## 🔌 APIs Integradas (gratuitas / sem chave)

| API | Uso | Chave Necessária |
|---|---|---|
| **Open-Meteo** | Clima em tempo real, previsão 7 dias, qualidade do ar | ❌ Não |
| **NASA APOD** | Foto astronômica do dia | ✅ DEMO_KEY (inclusa) |
| **NASA NEO** | Asteroides próximos da Terra | ✅ DEMO_KEY (inclusa) |
| **Where the ISS at** | Posição real da ISS | ❌ Não |
| **SpaceX r/SpaceX API** | Próximos lançamentos | ❌ Não |
| **NOAA/SWPC** | Clima espacial (via proxy corrigido) | ❌ Não |
| **OpenWeatherMap** | Dados extras (opcional) | ✅ Chave própria |
| **WeatherAPI** | UV, fases da lua, alertas (opcional) | ✅ Chave própria |

---

## 🎨 Stack Tecnológica

| Tecnologia | Uso |
|---|---|
| HTML5 + CSS3 | Estrutura e design do dashboard |
| JavaScript (ES6+) | Toda a lógica de negócio e integrações |
| CSS Custom Properties | Design system com variáveis de cor e tipografia |
| SVG animado | Mapas, radares e visualizações |
| Canvas 2D | Espectrograma SETI, fase da lua, gráfico de risco |
| Web Speech API | Comandos de voz em português |
| Kotlin | MainActivity Android com Jetpack Compose |
| Android WebView | Renderização do app web no dispositivo |
| Room DB | (declarado para rotas offline futuras) |
| FontAwesome 6 | Iconografia completa |
| Google Fonts (Inter, Rajdhani, JetBrains Mono) | Tipografia NASA-style |

---

## 🌱 ODS da ONU Atendidos

| ODS | Descrição | Como Aegis-Orbit Atende |
|---|---|---|
| **ODS 9** | Indústria, Inovação e Infraestrutura | Nova infraestrutura civil via satélites LEO |
| **ODS 11** | Cidades e Comunidades Sustentáveis | Rotas de fuga offline e alertas precoces |
| **ODS 13** | Ação Climática | Monitoramento de GEE e adaptabilidade |
| **ODS 2** | Fome Zero | Monitoramento de safras por satélite óptico |
| **ODS 8** | Trabalho Decente e Crescimento | Eco-créditos de carbono verificados |

---

## 📽️ Vídeo Pitch

> Insira o link do YouTube na seção **"Apresentação GS"** do dashboard.

---

## 📄 Licença

Projeto acadêmico — FIAP Global Solution 2026. Todos os direitos reservados.
