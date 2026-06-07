# 🛰️ AEGIS-ORBIT — Documentação Completa de Funcionalidades

> **Projeto:** FIAP Global Solution 2026  
> **Aluno:** Kalicon Amorim da Cruz Souza — RM 563172  
> **Curso:** Engenharia de Software — FIAP  
> **Tipo:** Aplicação Web + Aplicativo Android Nativo (Kotlin)

---

## 📋 Sumário

1. [Visão Geral e Objetivo](#1-visão-geral-e-objetivo)
2. [Problema que Resolve](#2-problema-que-resolve)
3. [Arquitetura do Sistema](#3-arquitetura-do-sistema)
4. [Seção 1 — Sala de Telemetria (Dashboard Principal)](#4-seção-1--sala-de-telemetria-dashboard-principal)
5. [Seção 2 — Missão Aegis (Infográfico Interativo)](#5-seção-2--missão-aegis-infográfico-interativo)
6. [Seção 3 — Simulador Android](#6-seção-3--simulador-android)
7. [Seção 4 — Apresentação Acadêmica (GS Slides)](#7-seção-4--apresentação-acadêmica-gs-slides)
8. [Seção 5 — ODS Alinhamento ONU](#8-seção-5--ods-alinhamento-onu)
9. [Seção 6 — Observatório Espacial](#9-seção-6--observatório-espacial)
10. [Funcionalidades Transversais](#10-funcionalidades-transversais)
11. [APIs e Integrações Externas](#11-apis-e-integrações-externas)
12. [Aplicativo Android Nativo](#12-aplicativo-android-nativo)
13. [Motor de Risco Preditivo (IA)](#13-motor-de-risco-preditivo-ia)
14. [Stack Tecnológica](#14-stack-tecnológica)
15. [Fluxo de Dados do Sistema](#15-fluxo-de-dados-do-sistema)

---

## 1. Visão Geral e Objetivo

O **Aegis-Orbit** é uma plataforma completa de **inteligência climática e monitoramento aeroespacial** desenvolvida como solução acadêmica para o FIAP Global Solution 2026. O sistema combina:

- Um **Dashboard Operacional Web** estilo NASA Mission Control, com dados em tempo real de múltiplas APIs espaciais e meteorológicas
- Um **Aplicativo Android Nativo** (Kotlin + Jetpack Compose) que replica todas as funcionalidades em tela móvel, com conectividade via satélite LEO (NTN) para funcionamento em cenários de desastre sem internet

**Objetivo Central:** Usar a infraestrutura de satélites de órbita baixa (LEO) como escudo preventivo para proteger populações urbanas vulneráveis contra desastres climáticos, integrando monitoramento via SAR, Infravermelho Térmico e análise espectral óptica de vegetação.

**Missão específica:**
- Detectar riscos de **deslizamento de terra e inundações** com antecedência de 24h a 48h via interferometria SAR (Sentinel-1)
- Garantir comunicação de **SOS** e rotas de fuga mesmo **sem sinal celular** (via uplink direto a satélites LEO)
- Incentivar o reflorestamento via **Eco-Créditos** verificados por satélite óptico (Sentinel-2)
- Monitorar anomalias aeroespaciais e **UAPs** via rede colaborativa SkyWatch

---

## 2. Problema que Resolve

### 2.1 Zonas Cegas de Monitoramento
Sensores terrestres não conseguem detectar **micro-deformações milimétricas** no solo de encostas antes do colapso geológico. A Aegis-Orbit usa interferometria **InSAR** (Radar de Abertura Sintética) dos satélites Sentinel-1, que mapeia essas deformações centímetro a centímetro de 524 km de altitude.

### 2.2 Apagão Tecnológico Durante Catástrofes
Tempestades e enchentes destroem as torres de telefonia 4G/5G, isolando comunidades justamente no momento mais crítico. O app Android usa a **Android Satellite API (NTN - Non-Terrestrial Network)** para transmitir SOS diretamente a satélites LEO de passagem, sem depender de infraestrutura terrestre.

### 2.3 Ausência de Ferramenta Integrada de Anomalias
Não existe uma rede científica pública que filtre **falsos positivos** (como satélites Starlink) e catalogue perturbações ionosféricas genuínas e UAPs. O módulo **Aegis SkyWatch** cria esse canal crowdsourced com validação por IA orbital.

---

## 3. Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    CAMADA DE DADOS ORBITAL                        │
│  Sentinel-1 SAR │ Sentinel-2 Óptico │ Landsat-9 TIRS │ ISS       │
│  NASA APOD/NEO  │ SpaceX API        │ NOAA SWPC       │ SETI       │
└────────────────────────┬────────────────────────────────────────┘
                         │ APIs REST / JSON
┌────────────────────────▼────────────────────────────────────────┐
│               CAMADA LÓGICA (JavaScript ES6+)                    │
│  main.js — 4.170 linhas de código                                │
│  ├── Motor de Telemetria (dados por setor/satélite)              │
│  ├── Motor de Risco Preditivo (algoritmo multi-fator)            │
│  ├── Hub Meteorológico (Open-Meteo + OWM + WeatherAPI)           │
│  ├── Decodificador SETI (Canvas + frequência dinâmica)           │
│  ├── Reconhecimento de Voz (Web Speech API)                      │
│  ├── ISS Tracker em tempo real                                   │
│  └── Simulador de Terminal ADB                                   │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTML/CSS + Canvas 2D + SVG
┌────────────────────────▼────────────────────────────────────────┐
│                 CAMADA DE APRESENTAÇÃO                           │
│  index.html + style.css (1.568 linhas HTML / 55KB CSS)           │
│  ├── Dashboard Operacional (Sala de Telemetria)                  │
│  ├── Missão Aegis (Infográfico 5 etapas)                        │
│  ├── Simulador Android (Google Pixel 8 Pro)                      │
│  ├── Apresentação Acadêmica (7 slides)                           │
│  ├── Observatório Espacial (NASA Live)                           │
│  └── ODS Alinhamento ONU                                         │
└────────────────────────────────────────────────────────────────┘
                         │ Android WebView (Kotlin)
┌────────────────────────▼────────────────────────────────────────┐
│              APP ANDROID NATIVO (br.com.fiap.aegisorbit)         │
│  MainActivity.kt + CSS android.css (override mobile)            │
│  ├── Edge-to-Edge Display (status bar transparente)              │
│  ├── Permissões: Microfone, Localização, Satélite NTN            │
│  ├── Room Database (rotas offline, relatórios, UAPs)             │
│  └── Android Satellite API (NTN Direct-to-Cell)                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Seção 1 — Sala de Telemetria (Dashboard Principal)

**Rota:** Acessada ao abrir o sistema (seção ativa por padrão)

Esta é a tela principal de operações, inspirada nos painéis de controle da NASA. Está dividida em:

### 4.1 Barra de Widgets (KPIs em tempo real)

| Widget | Descrição |
|---|---|
| **CONSTELLATION STATUS** | Número de satélites ativos na constelação (`14 / SENTINEL-1`) |
| **EARLY WARNINGS** | Setores com alertas críticos ativos (`2 SECTORS`) |
| **AI PREDICTION ACCURACY** | Precisão do modelo de IA preditiva (`94.8%`) |
| **POPULATION SAFEGUARDED** | Estimativa de população protegida pelos alertas (`124.800 PAX`) |

### 4.2 Mapa EOS-HUD (Earth Observation System)

Mapa SVG interativo que simula a visão orbital dos satélites. Funcionalidades:

#### Modos de Visualização (botões de alternância):

| Modo | Satélite | O que mostra |
|---|---|---|
| **SAR Radar (Inundações)** | Sentinel-1A | Mapa ciano; mede umidade de solo e risco hidrológico |
| **Infravermelho TIRS (Incêndios)** | Landsat-9 | Mapa laranja; focos de calor e temperatura de superfície |
| **Óptico (Reflorestamento)** | Sentinel-2B | Mapa verde; índice NDVI de cobertura vegetal |
| **SkyWatch (UAP/SETI)** | Orion-SETI (DSN) | Mapa violeta; anomalias ionosféricas e sinais de rádio |

#### Hotspots Interativos:
- **Setor Rio-A (ponto vermelho):** Risco hidrológico crítico — Rio de Janeiro. Clicando, o mapa faz zoom com animação de curva de Bézier e os dados de telemetria atualizam dinamicamente.
- **Setor Norte-B (ponto laranja):** Alerta de calor no Landsat-9 — Amazônia. Ao clicar, modo térmico é ativado.

#### HUD de Telemetria Orbital:
- **LAT/LON/ALT:** Posição calculada do satélite em graus, minutos e segundos — atualizada quadro a quadro via animação de curva de Bézier ao longo da trajetória orbital
- **PASS:** Identificação do satélite em passagem (`LEO-SAR-4`, `SENTINEL-1A`, etc.)
- Ao ativar o **ISS Tracker Real**, o painel passa a mostrar a latitude e longitude real da ISS em tempo real

#### Crosshair Interativo:
- Ao clicar em qualquer ponto do mapa, um **crosshair de mira** aparece com 2 anéis concêntricos e um ponto central
- Os dados de telemetria lateral se atualizam dinamicamente com base nas coordenadas selecionadas (latitude, longitude, análise de risco)
- **Função:** `lockTargetAt(x, y)` → converte coordenadas SVG para lat/lon real e exibe dados de cobertura

### 4.3 Painel de Telemetria Lateral

#### Cobertura de Telemetria (por setor selecionado)

4 métricas atualizadas dinamicamente conforme o modo de mapa e setor ativo:

| Modo | Métrica 1 | Métrica 2 | Métrica 3 | Métrica 4 |
|---|---|---|---|---|
| **SAR** | Umidade de Encosta | Anomalia Térmica | Índice de Precipitação | Probabilidade de Desastre |
| **Térmico** | Temperatura de Superfície | Focos Térmicos Ativos | Radiância Atmosférica | Risco de Combustão |
| **Óptico** | Índice NDVI | Cobertura de Canópia | Absorção de CO₂ | Status de Preservação |
| **SkyWatch** | Radiação Ionosférica | Frequência SETI | Densidade de Plasma | Classificação UAP |

**Gráfico de barras animado:** 3 barras verticais (Optical/Radar/Thermal) atualizam suas alturas com flutuação periódica a cada 4,5 segundos para simular stream de dados em tempo real.

### 4.4 Monitor de Clima Espacial (NOAA/SWPC)

Painel com dados do clima do espaço, atualizado via API NOAA ou fallback simulado:

| Métrica | Descrição |
|---|---|
| **Vento Solar** | Velocidade em km/s (ex: `412 km/s`) |
| **Fluxo de Prótons** | Intensidade em MeV |
| **Fluxo Raio-X** | Classificação de flare solar (A, B, C, M, X) |
| **Atividade Geomagnética** | Índice Kp (1–9) |

**Slider Geomagnético Interativo:**
- Deslize de Kp1 a Kp9 para simular tempestades solares
- Em Kp≥5: status vira `TEMPESTADE SOLAR ATIVA`, ícone pisca e cor muda para vermelho
- Em Kp≥8: status `TEMPESTADE SEVERA — RISCO ORBITAL`
- Botão **FLARE!** dispara uma tempestade solar animada no sistema

**Como funciona:**
```
Kp 1–3 → Estável (cyan)
Kp 4   → Moderado (orange)
Kp 5–6 → Tempestade Solar Ativa (red)
Kp 7–9 → Tempestade Severa (red piscando)
```

### 4.5 Hub Meteorológico Global

Painel multi-API para dados meteorológicos em tempo real. Funciona em cascata:

1. **Open-Meteo** (sem chave — sempre disponível) → dados principais
2. **OpenWeatherMap** (chave do usuário) → dados alternativos
3. **WeatherAPI.com** (chave do usuário) → dados premium (UV, lua, alertas)

**Dados exibidos:**
- Temperatura atual, sensação térmica, umidade
- Velocidade e direção do vento
- Índice UV com classificação de risco (Baixo → Extremo)
- Precipitação atual (mm/h)
- Visibilidade (km)
- Pressão atmosférica (hPa)

**Qualidade do Ar (AQI):** PM2.5, PM10, NO₂, Ozônio — com badge de qualidade colorido (Boa → Perigosa)

**Previsão 7 dias:** Tira horizontal com ícone climático, temperatura máx/mín e índice UV para cada dia da semana

**Alerta Operacional — Defesa Civil SP:**
- Analisa a precipitação atual em tempo real
- Se chuva > 10mm ou tempestade severa: dispara `ALERTA MÁXIMO` com toast de notificação
- Exibe descrição textual do nível de risco (0 a 3)

### 4.6 Console de Ações Telemétricas

Terminal de texto ao vivo que exibe logs automáticos do sistema:
- Eventos de troca de modo de mapa
- Resultados de consultas às APIs
- Alertas críticos destacados em vermelho
- Mensagens de status de uplink satelital
- Máximo de 15 linhas; rolagem automática para o fundo
- Timestamp `[HH:MM:SS]` em cada linha

### 4.7 Diagnóstico de Uplink e APIs

Tabela de status de cada API integrada:

| API | ID de Diagnóstico | Métricas |
|---|---|---|
| NASA APOD API | `status-nasa-apod` | Latência em ms, status (ONLINE/OFFLINE/ERROR) |
| NASA NEO | `status-nasa-neo` | Latência em ms |
| SpaceX Launch API | `status-spacex` | Latência em ms |
| ISS Locator API | `status-iss` | Latência em ms |
| Open-Meteo Weather | `status-inmet-alerts` | Latência em ms |
| Open-Meteo Air Quality | `status-openmeteo-aq` | Latência em ms |
| OpenWeatherMap API | `status-owm` | `SEM CHAVE` ou latência |
| WeatherAPI.com | `status-wapi` | `SEM CHAVE` ou latência |

**Status Geral:** Indicador `ALL LINKS ONLINE` / `LINK DEGRADED (N/5)` / `ALL LINKS OFFLINE`

---

## 5. Seção 2 — Missão Aegis (Infográfico Interativo)

**Rota:** Clicando em "Missão Aegis" na barra lateral

Seção educativa que explica em 5 etapas clicáveis como o sistema funciona:

### Etapas Interativas

Cada etapa, ao ser clicada, atualiza o painel visual à direita com um SVG animado exclusivo:

| Etapa | Título | Visualização |
|---|---|---|
| **01** | Varredura de Micro-Deformações (SAR) | Animação de pulso radar saindo do satélite Sentinel-1 e rebatendo na encosta |
| **02** | Predição por Rede Neural | Diagrama de rede neural com nós SAR/Thermal/IoT conectados à saída de risco |
| **03** | Uplink LEO em Emergências | Torre de celular riscada + seta animada pulsante saindo do smartphone para o satélite |
| **04** | Evacuação Topográfica Offline | Mapa com zona de risco vermelha, rota animada desviando do perigo e ponto seguro verde |
| **05** | Auditoria e Eco-Crédito de Carbono | Satélite com feixe de varredura sobre área revegetada, com output `NDVI VERIFIED: +0.68` |

**Painel de Infraestrutura:**
- Lista técnica dos satélites usados: Sentinel-1 (SAR Banda-C), Landsat-9 TIRS (Bandas 10 e 11), Sentinel-2 MSI (Óptico), Constelação LEO Aegis Uplink

---

## 6. Seção 3 — Simulador Android

**Rota:** Clicando em "Simulador Android"

Divisão em duas colunas: painel de informações à esquerda + dispositivo físico à direita

### 6.1 Coluna Esquerda — Painel de Informações (3 abas)

#### Aba 1: Recursos do App
Descrição detalhada das funcionalidades nativas:
- Android Satellite API Integration (NTN Direct-to-Cell)
- Room Local Database (Modelos de Elevação Digital ALOS)
- Rotas de fuga offline por análise topográfica
- Aegis SkyWatch com filtro de órbitas conhecidas

#### Aba 2: Código Kotlin Android (10 arquivos)
Visualizador de código-fonte real com syntax highlighting. Arquivos disponíveis:

| Arquivo | Conteúdo |
|---|---|
| `MainActivity.kt` | WebView Edge-to-Edge com permissões de satélite e microfone |
| `MapScreen.kt` | Tela de mapa com rotas offline (Jetpack Compose) |
| `TrackerScreen.kt` | Rastreamento de satélites LEO com UI de alinhamento |
| `SkyWatchScreen.kt` | Scanner ionosférico com câmera AR e filtros de UAP |
| `AppDatabase.kt` | Room DB com 3 entidades: ElevationPoint, CivilReport, UapSighting |
| `CivilReport.kt` | Entidade Room para relatórios de emergência |
| `UapSighting.kt` | Entidade Room para avistamentos de anomalias |
| `StarryBackground.kt` | Componente Compose de fundo estrelado animado |
| `AegisApiService.kt` | Retrofit com endpoints NASA, ISS e Weather |
| `build.gradle.kts` | Config completa com Room, Compose, Coroutines, Navigation |

#### Aba 3: Console ADB Shell Interativo
Terminal emulado do Android Debug Bridge com:
- **Botões de atalho:** `help`, `adb devices`, `aegis ntn --status`, `aegis telemetry --fetch`, `aegis uap --scan`, `clear`
- **Comandos suportados:** lista de ~20 comandos com respostas técnicas realistas
- **Histórico de comandos:** Setas ↑/↓ navegam no histórico (igual ao terminal real)
- **Respostas simuladas de:**
  - Status da conexão NTN satelital
  - Registros do banco de dados Room
  - Scans de anomalias ionosféricas
  - Logs de sistema Android

### 6.2 Coluna Direita — Simulador de Smartphone (Google Pixel 8 Pro)

Réplica fiel de um smartphone Android com:
- **Camera punch-hole** (furo na tela)
- **Status bar** com hora, ícone de satélite, Wi-Fi e bateria
- **Gesture pill** (barra gestual Android)
- **Bottom navigation bar** com 5 abas nativas

#### Telas Disponíveis (5 telas + lock screen):

**Lock Screen:**
- Relógio digital em tempo real (hora local)
- Data em português dinâmica (ex: "Quinta, 5 de Junho")
- Notificação de alerta de inundação do Aegis
- Animação de uplink satelital (loader) ao receber alertas

**Tela 1 — Rotas de Fuga Segura:**
- Mapa SVG com zona de risco vermelha, ponto de localização ciano e ponto seguro verde
- Rota de fuga animada com linha tracejada pulsante desviando da zona de risco
- Card com distância e elevação da rota segura
- Botão "Iniciar Orientação Offline"

**Tela 2 — Reportar Ocorrência:**
- Seleção do tipo: Alagamento, Deslizamento, Obstrução de Via
- Campo de texto descritivo
- Botão "Transmitir via Satélite LEO" → dispara loader de uplink animado (5 fases: Locking LEO, NTN Uplink Active, Transmitting, Packet Sent, UPLINK SUCCESSFUL)

**Tela 3 — Rastreamento LEO (Tracker):**
- Bússola 3D com 3 anéis concêntricos, eixos H/V e nó alvo
- Botão "Alinhar Antena Virtual" → sequência animada de 4 passos de calibração
- Badge muda de `SEM SINAL` para `LINK ATIVO` após alinhamento

**Tela 4 — Aegis SkyWatch:**
- Radar giratório com sweep animado e 2 blips de anomalia nos quadrantes
- Card de alerta com anomalia ionosférica detectada sobre Setor Rio-A
- Botão "Reportar Anomalia Luminosa" → loader de análise espectral em 5 fases

**Tela 5 — Comunidade Verde (Eco):**
- Score circular verde "780 XP — Nível 4 Guardião"
- Área validada como "Área Reforestada" por análise multiespectral
- Botão "Resgatar Crédito de Carbono" (400 ECO disponíveis)

---

## 7. Seção 4 — Apresentação Acadêmica (GS Slides)

**Rota:** Clicando em "Apresentação GS"

### 7.1 Deck de Slides (7 slides navegáveis)

| Slide | Título | Conteúdo |
|---|---|---|
| **1** | Capa FIAP GS 2026 | Nome, RM, identificação do projeto |
| **2** | O Problema | Zonas cegas, colapso de infraestrutura, ausência de ferramenta UAP |
| **3** | A Solução | Kotlin nativo, Android Satellite API, Aegis SkyWatch |
| **4** | Fluxo de Dados | Diagrama ASCII do pipeline orbital → dashboard → smartphone |
| **5** | Diferenciais | Uplink Direct-to-Cell, rotas offline Room DB, detecção descentralizada |
| **6** | ODS ONU | Conexão com ODS 2, 8, 9, 11, 13 |
| **7** | Vídeo Pitch | Thumbnail clicável + player do YouTube |

**Navegação:** Botões Anterior/Próximo com estado desabilitado nos extremos. Contador "Slide N de 7".

### 7.2 Painel de Configuração

**Edição de Dados do Aluno:**
- Nome completo e RM editáveis via `<input>` com atualização ao vivo no slide 1

**Link do Pitch YouTube:**
- Campo de URL do YouTube
- Thumbnail do vídeo torna-se clicável e abre em nova aba
- Fallback: exibe aviso quando URL não configurada

**Exportação em Markdown:**
- Botão "Copiar em Markdown" gera um texto acadêmico completo com:
  - Dados do aluno, descrição do app, problema, solução, arquitetura Room DB, ODS
  - Copiado para a área de transferência via `navigator.clipboard.writeText()`

---

## 8. Seção 5 — ODS Alinhamento ONU

**Rota:** Clicando em "ODS Alinhamento"

Cards visuais para 5 Objetivos de Desenvolvimento Sustentável com número colorido, título e descrição de como o Aegis-Orbit contribui:

| ODS | Cor | Como Aegis-Orbit Contribui |
|---|---|---|
| **ODS 2** — Fome Zero | Amarelo | Monitoramento de safras urbanas de subsistência por satélite óptico Sentinel-2; previsão de secas severas |
| **ODS 8** — Trabalho Decente | Vermelho | Eco-Créditos de carbono verificados por satélite; economia verde gamificada |
| **ODS 9** — Indústria e Inovação | Laranja | Nova infraestrutura civil via satélites LEO e constelação de downlink orbital |
| **ODS 11** — Cidades Sustentáveis | Amarelo-ouro | Alertas precoces e rotas de fuga offline para populações em áreas de risco |
| **ODS 13** — Ação Climática | Verde | Monitoramento de GEE, mapeamento de deformações geológicas, adaptabilidade de emergência |

**Seção narrativa final:** Parágrafo sobre o papel da economia espacial na sociedade e como o Aegis-Orbit demonstra que investimento espacial gera benefício civil imediato.

---

## 9. Seção 6 — Observatório Espacial

**Rota:** Clicando em "Observatório"

### 9.1 NASA APOD — Observação Óptica e Espectral

**4 modos de lente selecionáveis:**

| Lente | Descrição |
|---|---|
| **NASA Live (APOD)** | Carrega a foto astronômica do dia da NASA API em tempo real |
| **Lente H-Alpha (Nebulosa)** | Exibe imagem de nebulosa (`telescope_obs.png`) com overlay espectral |
| **Lente Gravitacional (M87*)** | Exibe imagem do buraco negro com halo laranja animado |
| **Canal Heliofísico (CME)** | Imagem de erupção solar (CME) com glitch de tela e ruído VHS |

**Dados do APOD:** Título, data formatada em PT-BR, explicação completa, crédito do autor/imagem

### 9.2 Rastreamento da ISS em Tempo Real

- Latitude e longitude atuais da ISS
- Velocidade: ~27.600 km/h
- Altitude: ~408 km
- Timestamp da última atualização
- Conectado a `api.wheretheiss.at` via polling a cada 3 segundos
- Quando ISS está sobre o Brasil: log especial no console com `[ISS-BRASIL]`

### 9.3 SpaceX Launch Tracker + Fase da Lua

**SpaceX:**
- Nome da missão e foguete (Falcon 9, Falcon Heavy, etc.)
- Countdown T-Minus em tempo real (`Xd Xh Xm Xs`)
- Detalhes da missão, local de lançamento, payloads
- Conectado à API pública SpaceX r/SpaceX

**Fase da Lua:**
- Calculada matematicamente com base na data atual
- Renderizada em canvas 2D com sombra animada (gibbous, crescent, new moon, full moon, etc.)
- Nome da fase em português (`LUA CHEIA`, `QUARTO CRESCENTE`, etc.)

### 9.4 Asteroides Próximos da Terra (NEO)

- Conectado à API **NASA JPL NeoWs (Near Earth Object Web Service)**
- Lista os asteroides mais próximos do dia atual com:
  - Nome do asteroide
  - Distância mínima da Terra (em km e LD — distâncias lunares)
  - Diâmetro estimado (mínimo e máximo em km)
  - Velocidade relativa (km/h)
  - Badge **POTENCIALMENTE PERIGOSO** em vermelho quando `is_potentially_hazardous = true`
- Formatação automática de distâncias e velocidades

### 9.5 Painel de Avistamentos da Comunidade

Feed simulado com 4 ocorrências recentes:
- Anomalia Luminosa — Setor Rio-A (UAP-CLASS 1)
- Bólido (Meteoro Brilhante) — Litoral SP (NATURAL)
- Passagem de Starlink-G4 (FALSO POSITIVO — descartado automaticamente)
- Distúrbio Eletromagnético Ionosférico — AM (NÃO CLASSIFICADO)

### 9.6 Decodificador de Sinais de Rádio SETI

Ferramenta interativa de análise de sinais de rádio extraterrestres:

**Espectrograma Waterfall (Canvas 2D):**
- Canvas animado que simula um waterfall de rádio-frequência em tempo real
- Ruído de fundo branco/colorido com variação aleatória frame a frame
- Ao se aproximar de 1.420 GHz: aparece um **sinal coerente** (linha vertical brilhante + pulso animado)
- A linha de sintonia vermelha (`LOCK`) aparece quando o sinal é detectado

**Slider de Frequência:**
- Range: 1.000 GHz a 2.000 GHz
- Em 1.420 GHz: frequência da linha de Hidrogênio neutro (HI) — alvo clássico do SETI
- Display atualiza em tempo real: `1.420 GHz`

**Decodificação:**
1. Usuário ajusta slider para 1.420 GHz
2. Botão "Decodificar Pacote de Dados" aparece
3. Clicando: executa sequência de 3 segundos de decodificação em texto na tela
4. Resultado: sequência de dados codificada em base-64/binário simulado com tradução parcial

---

## 10. Funcionalidades Transversais

### 10.1 Relógio de Missão UTC

Exibido no cabeçalho em tempo real. Formato: `HH:MM:SS UTC` — atualizado a cada segundo via `Date.getUTCHours/Minutes/Seconds`.

### 10.2 Header Dinâmico por Seção

Ao navegar entre seções, o título e subtítulo do cabeçalho mudam automaticamente:
- Dashboard → "Painel de Operações Orbitais"
- Missão → "Missão Aegis-Orbit"
- Simulador → "Simulador Android Nativo"
- etc.

### 10.3 Uplink de Voz (Web Speech API)

Botão de microfone no cabeçalho. Ao ativar:
- Usa `SpeechRecognition` em português (`pt-BR`) no modo contínuo
- Reconhece comandos de voz e executa ações no sistema:

| Comando de voz | Ação |
|---|---|
| "radar" / "chuva" / "alagamento" | Muda mapa para modo SAR |
| "térmica" / "calor" / "incêndio" | Muda mapa para modo Infravermelho |
| "floresta" / "óptico" | Muda mapa para modo Óptico |
| "seti" / "skywatch" / "sinal" | Muda mapa para modo SkyWatch |
| "simular alerta" / "defesa civil" | Abre simulador de Defesa Civil |
| "sintonizar" / "hidrogênio" | Sintoniza o SETI para 1.420 GHz e decodifica |
| "diagnóstico" / "status" | Relata quantos links de API estão online |
| "observatório" | Navega para seção do Observatório |
| "missão" | Navega para seção da Missão |

**Síntese de voz (TTS):** Ao processar comandos, o sistema responde em voz usando `SpeechSynthesisUtterance` em `pt-BR`.

### 10.4 Rastreamento ISS no Mapa Principal

Botão "RASTREAR ISS REAL" no canto do mapa SVG:
- Busca posição real da ISS a cada 3 segundos via `api.wheretheiss.at`
- Move o nó de satélite SVG para a posição real
- Pausa a animação de curva de Bézier durante o tracking
- Exibe badge `ISS OUT OF RANGE` quando a ISS está fora do viewbox do mapa

### 10.5 Sistema de Toast (Notificações)

Notificações flutuantes no canto inferior direito da tela:
- Ícone configurável (`fa-circle-check`, `fa-triangle-exclamation`, etc.)
- Fade-in/out com animação CSS
- Desaparece automaticamente após 3 segundos
- `phoneToast()`: versão para toasts dentro da tela do smartphone simulado

### 10.6 Flutuação de Dados em Tempo Real

A cada 4,5 segundos, os dados do setor ativo variam levemente:
- Temperatura do Setor Rio-A varia ±0.15°C
- Fluxo iônico do SkyWatch varia ±0.2 keV
- Alturas das barras do gráfico variam ±4% aleatoriamente
- Simula o comportamento de um sistema de telemetria real em streaming

### 10.7 Flash de Atualização de Dados

Sempre que um painel recebe dados frescos de uma API, ele pulsa brevemente com uma borda ciano (`data-updated` CSS class), indicando visualmente que os dados foram atualizados.

---

## 11. APIs e Integrações Externas

### 11.1 APIs sem chave (sempre funcionam)

| API | Endpoint Principal | Uso no Sistema |
|---|---|---|
| **Open-Meteo** | `api.open-meteo.com/v1/forecast` | Temperatura, chuva, vento, previsão 7 dias — São Paulo |
| **Open-Meteo Air Quality** | `air-quality-api.open-meteo.com/v1/air-quality` | PM2.5, PM10, NO₂, Ozônio |
| **Where the ISS at** | `api.wheretheiss.at/v1/satellites/25544` | Lat/Lon real da ISS a cada 3s |
| **SpaceX r/SpaceX API** | `api.spacexdata.com/v4/launches/next` | Próximo lançamento + countdown |

### 11.2 APIs com DEMO_KEY incluída (NASA)

| API | Uso | Limite |
|---|---|---|
| **NASA APOD** | `api.nasa.gov/planetary/apod` | 30 req/hora (DEMO_KEY) |
| **NASA NEO Web Service** | `api.nasa.gov/neo/rest/v1/feed` | 30 req/hora (DEMO_KEY) |

**Configuração de Chave Própria:** O usuário pode inserir sua própria chave NASA gratuita (registrada em api.nasa.gov) no painel de diagnóstico. A chave é salva em `localStorage`.

### 11.3 APIs opcionais (chave do usuário)

| API | O que adiciona |
|---|---|
| **OpenWeatherMap** | Dados alternativos de clima com melhor cobertura mundial |
| **WeatherAPI.com** | Índice UV, fase da lua, nascer/pôr do sol, alertas meteorológicos oficiais |

As chaves são salvas em `localStorage` (persistem entre sessões).

### 11.4 Diagnóstico e Latência

Cada chamada de API:
1. Registra `performance.now()` antes e depois do fetch
2. Calcula `elapsed` em millisegundos
3. Exibe no painel de diagnóstico como `Xms`
4. Em caso de erro: exibe mensagem de erro e muda status para `OFFLINE`/`ERROR`

---

## 12. Aplicativo Android Nativo

**Localização:** `android-app/app/src/main/java/br/com/fiap/aegisorbit/`

### 12.1 MainActivity.kt

Arquivo Kotlin principal com:
- **Edge-to-Edge Display:** `WindowCompat.setDecorFitsSystemWindows(window, false)` — status bar e navigation bar transparentes com ícones brancos
- **Permissões em Runtime:** `RECORD_AUDIO`, `ACCESS_FINE_LOCATION`, `SATELLITE_COMMUNICATION`
- **WebView Setup:**
  - `javaScriptEnabled = true`
  - `domStorageEnabled = true`
  - `allowFileAccess = true`
  - `mediaPlaybackRequiresUserGesture = false`
  - `setGeolocationEnabled(true)`
  - `setSupportZoom(false)` (zoom desabilitado para UX nativa)
  - `cacheMode = LOAD_DEFAULT` (suporte a cache offline)
- **Injeção de JS:** Ao carregar, injeta `document.body.classList.add('android-webview')` e `window.IS_ANDROID_WEBVIEW = true`
- **WebChromeClient:** Concede automaticamente permissões de mídia e geolocalização para o WebView

### 12.2 android.css — Override Mobile

CSS que transforma o layout desktop em mobile:

| Transformação | Como |
|---|---|
| Sidebar lateral → Bottom nav | `position: fixed; bottom: 0; flex-direction: row` |
| Dashboard grid → coluna única | `grid-template-columns: 1fr` |
| Header → coluna vertical | `flex-direction: column` |
| Widgets row → 2 colunas | `grid-template-columns: 1fr 1fr` |
| SDG grid → 2 colunas | `grid-template-columns: 1fr 1fr` |
| Modal preditivo → tela cheia | `width: 96%; max-height: 85vh` |
| Toast → acima do bottom nav | `bottom: 72px` |
| Safe area iOS/Android | `env(safe-area-inset-bottom)` |

### 12.3 Banco de Dados Room (3 entidades)

```
elevation_points        →  Pontos topográficos DEM (lat, lon, altitude, declive, setor)
civil_reports           →  Relatórios de emergência (tipo, descrição, GPS, timestamp, sincronizado)
uap_sightings           →  Avistamentos de anomalias (descrição, GPS, frequência, classificação)
```

### 12.4 AndroidManifest.xml

Permissões declaradas:
- `INTERNET` + `ACCESS_NETWORK_STATE`
- `RECORD_AUDIO` (comandos de voz)
- `ACCESS_FINE_LOCATION` + `ACCESS_COARSE_LOCATION`
- `SATELLITE_COMMUNICATION` (Android 15 NTN API)

**Configurações:** `hardwareAccelerated="true"`, `windowSoftInputMode="adjustResize"`, `configChanges="orientation|screenSize|keyboardHidden"`

### 12.5 Tema Dark — themes.xml

- `Theme.AegisOrbit`: `Theme.Material.NoActionBar` com background preto e status/navigation bar transparentes
- `Theme.AegisOrbit.EdgeToEdge`: layout em display cutout (`shortEdges`) sem contraste forçado

---

## 13. Motor de Risco Preditivo (IA)

**Modal:** "Centro de Simulação Climática & Análise Preditiva de Desastres (Defesa Civil SP)"

### 13.1 Variáveis de Entrada (4 sliders)

| Parâmetro | Range | Peso no risco |
|---|---|---|
| Chuva Acumulada (24h) | 0–150mm | 35% |
| Umidade/Saturação do Solo | 0–100% | 35% |
| Declividade da Encosta | 0–60° | 20% |
| Impermeabilização do Solo (urbano) | 0–100% | 10% |

### 13.2 Fórmula de Risco

```javascript
risk = (rain / 150) * 100 * 0.35   // fator chuva
     + moisture * 0.35               // fator umidade
     + (slope / 60) * 100 * 0.20    // fator declividade
     + urban * 0.10                  // fator urbanização

risk = Math.min(100, Math.max(0, Math.round(risk)))
```

### 13.3 Níveis de Alerta

| % Risco | Nível | Badge | Cor |
|---|---|---|---|
| 0–29% | Grau: Baixo (Nível 0) | ESTÁVEL | Verde |
| 30–59% | Grau: Atenção (Nível 1) | RISCO ATENÇÃO | Ciano |
| 60–79% | Grau: Severo (Nível 2) | ALERTA MÁXIMO | Laranja → Vermelho |
| 80–100% | Grau: Em Emergência / Crítico (Nível 3) | EMERGÊNCIA MÁXIMA | Vermelho |

Em nível Crítico com `slope >= 20°`: alerta específico de **deslizamento de terra**  
Em nível Crítico com `slope < 20°`: alerta específico de **inundação urbana**

### 13.4 Gráfico de Projeção (Canvas 2D)

- 6 pontos de projeção nas próximas 6 horas
- Curva quadrática de Bézier suavizada
- Gradiente ciano → laranja → vermelho conforme risco
- Preenchimento sob a curva com gradiente de opacidade

### 13.5 Ações do Modal

- **Disparar Sirenes:** Emite log crítico no console + toast + TTS em voz em português ("Sirenes ativadas em doze subestações comunitárias")
- **Dispensar Alerta:** Fecha o modal

---

## 14. Stack Tecnológica

### Frontend Web

| Tecnologia | Versão | Uso |
|---|---|---|
| HTML5 | — | Estrutura semântica (1.568 linhas) |
| CSS3 | — | Design system + animações (55KB) |
| JavaScript ES6+ | — | Toda a lógica (4.170 linhas) |
| SVG Animado | — | Mapas, radar SETI, gráficos |
| Canvas 2D | — | Espectrograma, fase da lua, gráfico de risco |
| Web Speech API | — | Reconhecimento + síntese de voz |
| FontAwesome 6.4 | CDN | Ícones completos |
| Google Fonts | CDN | Inter, Rajdhani, JetBrains Mono |

### Design System (CSS Custom Properties)

```css
--color-cyan:    #00E5FF   /* cor primária, dados de telemetria */
--color-orange:  #FF9100   /* alertas moderados */
--color-red:     #FF1744   /* emergências críticas */
--color-emerald: #00FF66   /* status seguro, eco */
--color-violet:  #D500F9   /* SkyWatch, UAPs, SETI */
--font-mono:     JetBrains Mono / Share Tech Mono
--font-heading:  Rajdhani
--font-display:  Orbitron
```

### Android

| Tecnologia | Versão | Uso |
|---|---|---|
| Kotlin | — | Linguagem principal |
| Jetpack Compose | BOM 2023.10 | UI declarativa |
| Android WebView | — | Renderiza o app web |
| Room DB | 2.6.0 | Banco de dados offline |
| Navigation Compose | 2.7.5 | Roteamento entre telas |
| Coroutines | 1.7.3 | Operações assíncronas |
| Retrofit (via API Service) | — | Chamadas REST |

### Requisitos Android

- **minSdk:** 26 (Android 8.0 Oreo)
- **targetSdk:** 34 (Android 14)
- **compileSdk:** 34
- **JVM:** 17

---

## 15. Fluxo de Dados do Sistema

```
[Usuário abre o sistema]
         │
         ▼
[initApp() — DOMContentLoaded]
    ├── initClocks()           → relógio UTC + hora do telefone + data lock screen
    ├── initConsole()          → console de telemetria com 4 logs iniciais
    ├── initSpaceWeather()     → painel de clima espacial
    ├── initMapClickCapture()  → captura de cliques no mapa SVG
    ├── initSetiWaterfall()    → canvas do espectrograma SETI
    ├── initAdbTerminal()      → terminal ADB interativo
    ├── initPhoneStars()       → estrelas animadas no simulador
    ├── animateSatelliteAndHUD() → loop de animação do satélite no mapa
    ├── startConsoleSimulation() → logs automáticos a cada 7s
    ├── startDataFluctuation()   → variação de dados a cada 4.5s
    └── fetchAllWeather()         → busca clima em Open-Meteo imediatamente

[Usuário navega para "Observatório"]
         │
         ▼
[initObservatory() — executado 1x]
    ├── fetchAPOD()            → NASA API → imagem + título + explicação
    ├── fetchNEO()             → NASA JPL → lista de asteroides do dia
    ├── fetchSpaceXLaunch()    → SpaceX API → próxima missão + countdown
    ├── fetchISSPosition()     → Where the ISS at → polling a cada 3s
    ├── drawMoonPhase()        → cálculo local da fase lunar
    └── initSetiWaterfall()    → canvas do espectrograma SETI

[Usuário clica em hotspot no mapa]
         │
         ▼
[selectHotspot(sectorId)]
    ├── animateSvgViewBox()    → zoom suavizado no mapa via easing
    ├── updateTelemetryLabelsAndValues() → dados do setor ativo
    └── atualiza notificação do lock screen do telefone

[Usuário ativa voz]
         │
         ▼
[toggleVoiceUplink()]
    ├── SpeechRecognition.start()  → modo contínuo pt-BR
    ├── onresult → processVoiceCommand(transcript)
    │   ├── changeMapMode()        → se detecta "radar", "calor", etc.
    │   ├── switchSection()        → se detecta "observatório", "missão", etc.
    │   └── triggerEmergencyAlertSP() → se detecta "defesa civil"
    └── speakText()                → TTS responde em voz

[Usuário move slider de chuva no modal da Defesa Civil]
         │
         ▼
[updatePredictiveRisk()]
    ├── Calcula risco via fórmula multi-fator
    ├── Atualiza % em tempo real na tela
    ├── drawPredictiveChart() → gráfico de projeção no canvas
    └── Sincroniza com badges do painel lateral
```

---

## 📎 Arquivos do Projeto

| Arquivo | Tamanho | Descrição |
|---|---|---|
| `index.html` | 129KB / 1.568 linhas | Dashboard completo web |
| `css/style.css` | 55KB | Design system e animações |
| `js/main.js` | 189KB / 4.170 linhas | Toda a lógica do sistema |
| `android-app/app/src/main/java/.../MainActivity.kt` | 5.7KB / 130 linhas | App Android principal |
| `android-app/app/src/main/assets/css/android.css` | 13KB / 510 linhas | Override mobile CSS |
| `android-app/app/src/main/AndroidManifest.xml` | 1.7KB | Permissões e configuração |

---

*Documentação gerada em Junho de 2026 — Projeto Aegis-Orbit FIAP GS*
