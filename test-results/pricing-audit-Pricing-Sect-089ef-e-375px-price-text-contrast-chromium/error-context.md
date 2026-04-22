# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pricing-audit.spec.ts >> Pricing Section at Mobile 375px >> price text contrast
- Location: e2e/pricing-audit.spec.ts:48:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#pricing .font-display.text-6xl').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pricing .font-display.text-6xl').first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Saltar al contenido principal" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - progressbar "Page scroll progress" [ref=e5]
  - main [ref=e7]:
    - main [ref=e8]:
      - progressbar "Scroll progress":
        - generic:
          - generic:
            - generic: Testimonios
      - generic:
        - generic:
          - img
          - generic: 3 min de lectura
      - generic [ref=e13]:
        - navigation [ref=e14]:
          - link "MaatWork - Volver al inicio" [ref=e15] [cursor=pointer]:
            - /url: "#"
            - generic [ref=e16]: MaatWork
          - generic [ref=e19]:
            - button "Probar gratis" [ref=e20]:
              - generic [ref=e21]: Probar gratis
            - button "Reservar lugar" [ref=e22]:
              - generic [ref=e23]: Reservar lugar
            - button "Menu" [ref=e24] [cursor=pointer]
        - generic [ref=e29]:
          - link "Características" [ref=e30] [cursor=pointer]:
            - /url: "#features"
            - generic [ref=e31]: Características
          - link "Precios" [ref=e33] [cursor=pointer]:
            - /url: "#pricing"
            - generic [ref=e34]: Precios
          - link "Cómo funciona" [ref=e36] [cursor=pointer]:
            - /url: "#how-it-works"
            - generic [ref=e37]: Cómo funciona
          - link "Testimonios" [ref=e39] [cursor=pointer]:
            - /url: "#testimonials"
            - generic [ref=e40]: Testimonios
          - link "Contacto" [ref=e42] [cursor=pointer]:
            - /url: "#contact"
            - generic [ref=e43]: Contacto
          - button "Probar gratis" [ref=e46]:
            - generic [ref=e47]: Probar gratis
      - generic [ref=e58]:
        - generic [ref=e59] [cursor=pointer]:
          - img [ref=e61]
          - generic [ref=e63]:
            - img [ref=e64]
            - text: Beta
        - paragraph [ref=e67]: Primeras 5 apps con precio especial de lanzamiento — cupos limitados
        - link "Reservar tu lugar con precio de lanzamiento" [ref=e68] [cursor=pointer]:
          - /url: "#pricing"
          - generic [ref=e70]: Reservar
          - generic [ref=e71]: →
        - button "Cerrar notificación" [ref=e72]:
          - img [ref=e73]
      - generic [ref=e77]:
        - status "Cargando escena 3D..." [ref=e82]
        - generic:
          - generic:
            - img
          - generic:
            - img
          - generic:
            - img
          - generic:
            - img
        - generic [ref=e95]:
          - generic [ref=e96]:
            - generic [ref=e98]: Apps para negocios argentinos
            - heading "Deja de pe| automa| H|" [level=1] [ref=e100]:
              - generic [ref=e102]: Deja de pe|
              - generic [ref=e105]: automa|
              - generic [ref=e107]: H|
            - paragraph [ref=e108]: La única plataforma que desarrolla tu app personalizada en 7-14 días. Clientes, cobros, turnos y WhatsApp automático — sin que vos hagas nada.
            - generic [ref=e109]:
              - button "Proba gratis 7 dias" [ref=e110] [cursor=pointer]:
                - generic [ref=e111]:
                  - text: Proba gratis 7 dias
                  - img [ref=e112]
              - button "Sin tarjeta · Sin compromiso" [ref=e114] [cursor=pointer]:
                - generic [ref=e115]: Sin tarjeta · Sin compromiso
            - generic [ref=e116]:
              - generic [ref=e117]:
                - generic [ref=e120]: 1-
                - generic [ref=e121]: Dias para tu app
              - generic [ref=e122]:
                - generic [ref=e125]: 0+
                - generic [ref=e126]: Rubros activos
              - generic [ref=e127]:
                - generic [ref=e128]: 24/7
                - generic [ref=e129]: Automatizacion
          - generic [ref=e130]:
            - generic [ref=e131]:
              - generic [ref=e133]: Natatorio
              - generic [ref=e134]: Grupos de Natacion · 42/50 asistentes
            - generic [ref=e135]:
              - generic [ref=e137]: Peluqueria
              - generic [ref=e138]: 15:30 Corte & Barba · 16:15 Color
            - generic [ref=e139]:
              - generic [ref=e141]: Academia
              - generic [ref=e142]: 128 Alumnos Activos
      - generic:
        - img
        - img
      - generic [ref=e150]:
        - generic [ref=e151]:
          - generic [ref=e154]: El problema real
          - heading [level=2] [ref=e156]: ¿Seguir perdendo clientes, dinero y tiempo?
          - paragraph [ref=e157]: El 78% de los negocios en Argentina siguen administrando con papel, WhatsApp y Excel. Perdiendo en promedio $120.000/mes en oportunidades.
        - generic [ref=e158]:
          - generic [ref=e161]:
            - img [ref=e164]
            - img [ref=e167]
            - generic [ref=e169]:
              - img [ref=e172]
              - generic [ref=e175]:
                - generic [ref=e176]:
                  - heading [level=3] [ref=e177]: Sin MaatWork
                  - generic [ref=e178]: Perdidas
                - paragraph [ref=e179]: La realidad de la mayoria
            - list [ref=e180]:
              - listitem [ref=e181]:
                - generic [ref=e184]:
                  - img [ref=e187]
                  - generic [ref=e190]:
                    - generic [ref=e191]: Gestion manual de turnos que consume horas
                    - generic [ref=e192]: "-2hrs/dia"
                  - img [ref=e194]
              - listitem [ref=e198]:
                - generic [ref=e201]:
                  - img [ref=e204]
                  - generic [ref=e209]:
                    - generic [ref=e210]: 30% de clientes olvidan sus turnos
                    - generic [ref=e211]: "-$50K/mes"
                  - img [ref=e213]
              - listitem [ref=e217]:
                - generic [ref=e220]:
                  - img [ref=e223]
                  - generic [ref=e226]:
                    - generic [ref=e227]: Cobros que se vencen y nunca llegan
                    - generic [ref=e228]: "-15% ingresos"
                  - img [ref=e230]
              - listitem [ref=e234]:
                - generic [ref=e237]:
                  - img [ref=e240]
                  - generic [ref=e244]:
                    - generic [ref=e245]: WhatsApp saturado de mensajes repetitivos
                    - generic [ref=e246]: "-3hrs/dia"
                  - img [ref=e248]
            - generic [ref=e253]:
              - generic [ref=e254]: Perdida mensual estimada
              - generic [ref=e255]: $120.000+
          - generic [ref=e267]:
            - img [ref=e270]
            - generic [ref=e273]:
              - img [ref=e276]
              - generic [ref=e280]:
                - generic [ref=e281]:
                  - heading [level=3] [ref=e282]: Con MaatWork
                  - generic [ref=e283]:
                    - img [ref=e284]
                    - text: Ganancias
                - paragraph [ref=e287]: La transformacion que necesitas
            - list [ref=e288]:
              - listitem [ref=e289]:
                - generic [ref=e292]:
                  - img [ref=e295]
                  - generic [ref=e298]:
                    - generic [ref=e299]: Agenda automatica que se llena sola
                    - generic [ref=e300]:
                      - generic [ref=e301]: +40%
                      - generic [ref=e303]: mas clientes
                  - img [ref=e304]
              - listitem [ref=e307]:
                - generic [ref=e310]:
                  - img [ref=e313]
                  - generic [ref=e318]:
                    - generic [ref=e319]: Recordatorios por WhatsApp personalizados
                    - generic [ref=e320]:
                      - generic [ref=e321]: "0"
                      - generic [ref=e323]: cancelaciones
                  - img [ref=e324]
              - listitem [ref=e327]:
                - generic [ref=e330]:
                  - img [ref=e333]
                  - generic [ref=e335]:
                    - generic [ref=e336]: Cobros con un clic y seguimiento automatico
                    - generic [ref=e337]:
                      - generic [ref=e338]: +25%
                      - generic [ref=e340]: cobro efectivo
                  - img [ref=e341]
              - listitem [ref=e344]:
                - generic [ref=e347]:
                  - img [ref=e350]
                  - generic [ref=e353]:
                    - generic [ref=e354]: Respuestas automaticas 24/7
                    - generic [ref=e355]:
                      - generic [ref=e356]: +2hrs
                      - generic [ref=e358]: libres diario
                  - img [ref=e359]
            - generic [ref=e363]:
              - generic [ref=e364]: Recuperacion de ingresos
              - generic [ref=e365]: +40%
        - generic [ref=e366]:
          - generic [ref=e368]: Comparacion visual
          - generic [ref=e371]:
            - generic [ref=e373]:
              - img [ref=e375]
              - generic [ref=e379]: SIN MaatWork
              - generic [ref=e380]: Administracion manual, perdidas, caos
              - generic [ref=e384]: 85% ineficiente
            - generic [ref=e387]:
              - img [ref=e389]
              - generic [ref=e392]: CON MaatWork
              - generic [ref=e393]: Automatizacion inteligente, crecimiento
              - generic [ref=e397]: 95% eficiente
            - generic [ref=e401]:
              - img [ref=e402]
              - img [ref=e404]
            - generic [ref=e406]: ANTES
            - generic [ref=e407]: DESPUES
          - paragraph [ref=e408]: Arrastra el control para comparar
        - generic [ref=e410]:
          - generic [ref=e411]:
            - generic [ref=e412]: SIN
            - generic [ref=e413]: —
            - generic [ref=e414]: Perdidas, caos, stress
          - img [ref=e417]
          - generic [ref=e419]:
            - generic [ref=e420]: CON
            - generic [ref=e421]: —
            - generic [ref=e422]: Crecimiento, orden, libertad
      - region [ref=e424]:
        - generic [ref=e426]:
          - generic [ref=e427]:
            - generic [ref=e428]: Funcionalidades
            - heading [level=2] [ref=e431]: Una app que trabaja por vos, 24/7
            - paragraph [ref=e432]: Todo lo que necesitas para automatizar tu negocio y recuperar tiempo libre
          - generic [ref=e433]:
            - button [ref=e434] [cursor=pointer]:
              - generic [ref=e437]:
                - img [ref=e439]
                - generic [ref=e444]:
                  - heading [level=3] [ref=e445]: Gestion de Clientes
                  - paragraph [ref=e446]: "Cada cliente tiene su ficha digital: datos de contacto, membresia, asistencia e historial completo."
                - generic [ref=e448]:
                  - img [ref=e449]
                  - text: Premium
            - button [ref=e453] [cursor=pointer]:
              - generic [ref=e456]:
                - img [ref=e458]
                - generic [ref=e460]:
                  - heading [level=3] [ref=e461]: Cobros y Cuotas
                  - paragraph [ref=e462]: Registra cobros y deja que la app maneje los recordatorios de pago automaticamente.
            - button [ref=e464] [cursor=pointer]:
              - generic [ref=e467]:
                - img [ref=e469]
                - generic [ref=e471]:
                  - heading [level=3] [ref=e472]: Turnos y Clases
                  - paragraph [ref=e473]: Organiza grupos o turnos con horarios y capacidades. Sin confusiones ni overlaps.
            - button [ref=e475] [cursor=pointer]:
              - generic [ref=e478]:
                - img [ref=e480]
                - generic [ref=e482]:
                  - heading [level=3] [ref=e483]: WhatsApp Automatico
                  - paragraph [ref=e484]: Mensajes automaticos sin que hagas nada. Confirmar turnos, avisar cuotas pendientes.
            - button [ref=e486] [cursor=pointer]:
              - generic [ref=e489]:
                - img [ref=e491]
                - generic [ref=e493]:
                  - heading [level=3] [ref=e494]: Panel para el Dueno
                  - paragraph [ref=e495]: Entras al panel y en 10 segundos sabes como viene el mes. Sin pedirle nada a nadie.
            - button [ref=e497] [cursor=pointer]:
              - generic [ref=e500]:
                - img [ref=e502]
                - generic [ref=e505]:
                  - heading [level=3] [ref=e506]: Hecha a Medida
                  - paragraph [ref=e507]: No es generica. Disenamos la app para tus procesos especificos desde cero.
      - generic [ref=e531]:
        - generic [ref=e532]:
          - generic [ref=e535]: Transformacion Real
          - heading [level=2] [ref=e537]:
            - text: De perder clientes a
            - generic [ref=e538]: crecer 40%
            - text: en 3 meses
          - paragraph [ref=e540]: Mira la diferencia entre gestionar tu negocio con metodos tradicionales vs. con MaatWork
        - switch [ref=e542] [cursor=pointer]:
          - generic [ref=e545]:
            - img [ref=e546]
            - generic [ref=e550]: Antes
          - generic [ref=e552]:
            - img [ref=e553]
            - generic [ref=e556]: Despues
        - generic [ref=e557]:
          - generic [ref=e558]:
            - generic [ref=e562]:
              - img [ref=e565]
              - generic [ref=e569]: SIN MaatWork
              - generic [ref=e570]: Administracion manual, caos y perdidas
            - generic [ref=e574]:
              - img [ref=e577]
              - generic [ref=e580]: CON MaatWork
              - generic [ref=e581]: Automatizacion inteligente y crecimiento
            - generic [ref=e585]:
              - img [ref=e586]
              - img [ref=e588]
            - generic [ref=e590]: ANTES
            - generic [ref=e591]: DESPUES
          - generic [ref=e593]:
            - generic [ref=e594]:
              - img [ref=e596]
              - generic [ref=e599]:
                - generic [ref=e600]: Metricas Clave
                - generic [ref=e601]: Lo que cambia con MaatWork
            - generic [ref=e602]:
              - generic [ref=e604]:
                - generic [ref=e605]:
                  - img [ref=e608]
                  - generic [ref=e611]:
                    - generic [ref=e612]: Horas de administracion
                    - generic [ref=e613]: Tiempo dedicado a tareas administrativas
                - generic [ref=e616]: 7 hrs/semana
              - generic [ref=e621]:
                - generic [ref=e622]:
                  - img [ref=e625]
                  - generic [ref=e627]:
                    - generic [ref=e628]: Cobros perdidos
                    - generic [ref=e629]: Ingresos que se escapan por falta de seguimiento
                - generic [ref=e632]: 10 % mensual
              - generic [ref=e637]:
                - generic [ref=e638]:
                  - img [ref=e641]
                  - generic [ref=e646]:
                    - generic [ref=e647]: Clientes activos
                    - generic [ref=e648]: Capacidad de gestionar tu base de clientes
                - generic [ref=e650]: "39"
              - generic [ref=e655]:
                - generic [ref=e656]:
                  - img [ref=e659]
                  - generic [ref=e661]:
                    - generic [ref=e662]: Respuestas a WhatsApp
                    - generic [ref=e663]: Mensajes manuales que tenes que responder
                - generic [ref=e666]: 33 /dia
        - generic [ref=e670]:
          - generic [ref=e671]:
            - heading [level=3] [ref=e672]: Los problemas de no tener app
            - paragraph [ref=e673]: Cada hora que pasa sin un sistema es dinero que se pierde
          - generic [ref=e674]:
            - generic [ref=e676]:
              - img [ref=e681]
              - generic [ref=e688]:
                - heading [level=4] [ref=e689]: Sin sistema
                - paragraph [ref=e690]: Todo en papel o planillas de Excel desactualizadas
            - generic [ref=e692]:
              - img [ref=e697]
              - generic [ref=e703]:
                - heading [level=4] [ref=e704]: Perdida de tiempo
                - paragraph [ref=e705]: 3-4 horas diarias en tareas administrativas
            - generic [ref=e707]:
              - img [ref=e712]
              - generic [ref=e719]:
                - heading [level=4] [ref=e720]: Sin control
                - paragraph [ref=e721]: No sabes que entra y que sale todos los dias
        - generic [ref=e722]:
          - generic [ref=e724]:
            - generic [ref=e725]:
              - img [ref=e728]
              - generic [ref=e731]:
                - generic [ref=e732]: Semana 1-2
                - generic [ref=e733]: Diagnostico y diseno
                - generic [ref=e734]: Analizamos tu negocio y disenamos la app a tu medida
            - generic [ref=e735]:
              - img [ref=e738]
              - generic [ref=e743]:
                - generic [ref=e744]: Semana 2-3
                - generic [ref=e745]: Desarrollo
                - generic [ref=e746]: Programamos tu app con todas las funcionalidades
            - generic [ref=e747]:
              - img [ref=e749]
              - generic [ref=e753]:
                - generic [ref=e754]: Semana 3-4
                - generic [ref=e755]: Pruebas y lanzamiento
                - generic [ref=e756]: Testeamos juntos que todo funcione perfecto
          - generic [ref=e757]:
            - button [ref=e758] [cursor=pointer]:
              - generic [ref=e760]:
                - text: Quiero cambiar mi negocio
                - img [ref=e761]
            - paragraph [ref=e764]: Sin tarjeta · Sin compromiso · En 7-14 dias tenes tu app
      - generic [ref=e767]:
        - generic [ref=e768]:
          - generic [ref=e769]: El proceso
          - heading [level=2] [ref=e771]: Tu app lista en dias, no en meses
          - paragraph [ref=e772]: Solo 3 pasos para tener tu propia app funcionando
        - generic [ref=e773]:
          - generic [ref=e775]:
            - img [ref=e782]
            - generic [ref=e786]: "01"
            - heading [level=3] [ref=e788]: Diagnostico
            - paragraph [ref=e789]: Contanos tu situacion y besoins. Analizamos tus procesos y disenamos la solucion perfecta.
          - generic [ref=e794]:
            - img [ref=e801]
            - generic [ref=e805]: "02"
            - heading [level=3] [ref=e807]: Prototipo
            - paragraph [ref=e808]: Te mostarmos una idea clara en 48hs. Ves exactamente como va a funcionar tu app.
          - generic [ref=e813]:
            - img [ref=e820]
            - generic [ref=e824]: "03"
            - heading [level=3] [ref=e826]: Launch
            - paragraph [ref=e827]: Tu app lista en 7-14 dias. Deployment automatico y soporte incluido.
        - generic [ref=e832]:
          - img [ref=e834]
          - generic [ref=e837]: "Tiempo promedio de entrega: 7 a 14 dias habiles"
      - generic [ref=e845]:
        - generic [ref=e846]:
          - generic [ref=e847]:
            - img [ref=e848]
            - text: Testimonios
            - img [ref=e850]
          - heading [level=2] [ref=e852]: Ya lo están usando
          - paragraph [ref=e853]: Negocios como el tuyo que ya automatizaron sus procesos
        - generic [ref=e854]:
          - generic [ref=e855]:
            - generic [ref=e859]:
              - generic [ref=e860]:
                - img [ref=e861]
                - img [ref=e863]
                - img [ref=e865]
                - img [ref=e867]
                - img [ref=e869]
              - blockquote [ref=e871]: “Pasamos de perder el 30% de los clientes por olvido a tener 0 cancelaciones. El WhatsApp automático cambió todo.”
              - generic [ref=e872]:
                - generic [ref=e873]:
                  - generic [ref=e874]: MR
                  - generic [ref=e875]:
                    - generic [ref=e876]: Martin Rodriguez
                    - generic [ref=e877]: Natatorio Acuática
                - generic [ref=e878]: +40% retención
            - generic [ref=e882]:
              - generic [ref=e883]:
                - img [ref=e884]
                - img [ref=e886]
                - img [ref=e888]
                - img [ref=e890]
                - img [ref=e892]
              - blockquote [ref=e894]: “Mi agenda ahora se llena sola. Los clientes confirman turnos por WhatsApp y yo solo me-focus en cortar.”
              - generic [ref=e895]:
                - generic [ref=e896]:
                  - generic [ref=e897]: LM
                  - generic [ref=e898]:
                    - generic [ref=e899]: Laura Mendes
                    - generic [ref=e900]: Peluquería Color
                - generic [ref=e901]: +60% eficiencia
            - generic [ref=e905]:
              - generic [ref=e906]:
                - img [ref=e907]
                - img [ref=e909]
                - img [ref=e911]
                - img [ref=e913]
                - img [ref=e915]
              - blockquote [ref=e917]: “Cobrar cuotas era un dolor de cabeza. Ahora con un clic mando recordatorios y cobros. Tiempo解放.”
              - generic [ref=e918]:
                - generic [ref=e919]:
                  - generic [ref=e920]: DF
                  - generic [ref=e921]:
                    - generic [ref=e922]: Diego Fernandez
                    - generic [ref=e923]: Gimnasio PowerFit
                - generic [ref=e924]: +25% cobranzas
            - generic [ref=e928]:
              - generic [ref=e929]:
                - img [ref=e930]
                - img [ref=e932]
                - img [ref=e934]
                - img [ref=e936]
                - img [ref=e938]
              - blockquote [ref=e940]: “Los pedidos por WhatsApp se gestionan solos. Ya no pierdo horas respondiendo mensajes, puedo enfocarme en hornear.”
              - generic [ref=e941]:
                - generic [ref=e942]:
                  - generic [ref=e943]: CR
                  - generic [ref=e944]:
                    - generic [ref=e945]: Carmen Ruiz
                    - generic [ref=e946]: Panadería Delicia
                - generic [ref=e947]: +80% pedidos
            - generic [ref=e951]:
              - generic [ref=e952]:
                - img [ref=e953]
                - img [ref=e955]
                - img [ref=e957]
                - img [ref=e959]
                - img [ref=e961]
              - blockquote [ref=e963]: “La app me permite mostrar el catálogo de trabajos a clientes nuevos. Cierro trabajos solo con enviar un link.”
              - generic [ref=e964]:
                - generic [ref=e965]:
                  - generic [ref=e966]: GH
                  - generic [ref=e967]:
                    - generic [ref=e968]: Gustavo Herrera
                    - generic [ref=e969]: Herrería Industrial
                - generic [ref=e970]: +50% clientes
            - generic [ref=e974]:
              - generic [ref=e975]:
                - img [ref=e976]
                - img [ref=e978]
                - img [ref=e980]
                - img [ref=e982]
                - img [ref=e984]
              - blockquote [ref=e986]: “Gestiono audiencias y recordatorios desde la app. Mis clientes reciben alertas automáticas. Menos olvidos, más confianza.”
              - generic [ref=e987]:
                - generic [ref=e988]:
                  - generic [ref=e989]: AV
                  - generic [ref=e990]:
                    - generic [ref=e991]: Ana Lucia Vega
                    - generic [ref=e992]: Estudio Jurídico
                - generic [ref=e993]: +35% puntualidad
            - generic [ref=e995]:
              - generic [ref=e997]:
                - img [ref=e998]
                - img [ref=e1001]
                - generic [ref=e1003]: 1:24
                - button [ref=e1004] [cursor=pointer]
              - generic [ref=e1006]:
                - generic [ref=e1007]:
                  - generic [ref=e1008]: MF
                  - generic [ref=e1009]:
                    - generic [ref=e1010]: Maria Fernandez
                    - generic [ref=e1011]: Centro de Estética Bella
                - generic [ref=e1012]:
                  - img [ref=e1013]
                  - generic [ref=e1015]: Video
            - generic [ref=e1017]:
              - generic [ref=e1019]:
                - img [ref=e1020]
                - img [ref=e1023]
                - generic [ref=e1025]: 2:05
                - button [ref=e1026] [cursor=pointer]
              - generic [ref=e1028]:
                - generic [ref=e1029]:
                  - generic [ref=e1030]: CM
                  - generic [ref=e1031]:
                    - generic [ref=e1032]: Carlos Mendoza
                    - generic [ref=e1033]: Consultorio Dental Sonrisa
                - generic [ref=e1034]:
                  - img [ref=e1035]
                  - generic [ref=e1037]: Video
          - generic [ref=e1038]:
            - button [ref=e1039]
            - button [ref=e1040]
            - button [ref=e1041]
            - button [ref=e1042]
            - button [ref=e1043]
            - button [ref=e1044]
            - button [ref=e1045]
            - button [ref=e1046]
          - generic [ref=e1048]: 01 / 08
      - generic [ref=e1053]:
        - generic [ref=e1054]:
          - generic [ref=e1055]:
            - generic [ref=e1056]: 0+
            - generic [ref=e1057]: Apps entregadas
          - generic [ref=e1058]:
            - generic [ref=e1059]: 0%
            - generic [ref=e1060]: Clientes satisfechos
          - generic [ref=e1061]:
            - generic [ref=e1062]: "0"
            - generic [ref=e1063]: Días máx. entrega
          - generic [ref=e1064]:
            - generic [ref=e1065]: 0/7
            - generic [ref=e1066]: Soporte
        - generic [ref=e1068]:
          - generic [ref=e1070]: Trusted by industry leaders
          - generic [ref=e1072]:
            - generic [ref=e1076] [cursor=pointer]: TechCorp
            - generic [ref=e1080] [cursor=pointer]: Innovate
            - generic [ref=e1084] [cursor=pointer]: Digital
            - generic [ref=e1088] [cursor=pointer]: CloudBase
            - generic [ref=e1094] [cursor=pointer]: DataPro
            - generic [ref=e1098] [cursor=pointer]: NextGen
            - generic [ref=e1104] [cursor=pointer]: SmartStack
            - generic [ref=e1109] [cursor=pointer]: AIVenture
            - generic [ref=e1113] [cursor=pointer]: TechCorp
            - generic [ref=e1117] [cursor=pointer]: Innovate
            - generic [ref=e1121] [cursor=pointer]: Digital
            - generic [ref=e1125] [cursor=pointer]: CloudBase
            - generic [ref=e1131] [cursor=pointer]: DataPro
            - generic [ref=e1135] [cursor=pointer]: NextGen
            - generic [ref=e1141] [cursor=pointer]: SmartStack
            - generic [ref=e1146] [cursor=pointer]: AIVenture
        - generic [ref=e1147]:
          - generic [ref=e1151]:
            - img [ref=e1156]
            - generic [ref=e1159]:
              - generic [ref=e1160]: Datos seguros
              - generic [ref=e1161]: Encriptación de grado bancario
            - img [ref=e1163]
          - generic [ref=e1177]:
            - img [ref=e1182]
            - generic [ref=e1185]:
              - generic [ref=e1186]: Activación rápida
              - generic [ref=e1187]: Tu app en 7-14 días
            - img [ref=e1189]
          - generic [ref=e1203]:
            - img [ref=e1208]
            - generic [ref=e1211]:
              - generic [ref=e1212]: Soporte dedicado
              - generic [ref=e1213]: Te acompañamos siempre
            - img [ref=e1215]
          - generic [ref=e1229]:
            - img [ref=e1234]
            - generic [ref=e1238]:
              - generic [ref=e1239]: Garantía 30 días
              - generic [ref=e1240]: Si no funciona, te devolvemos
            - img [ref=e1242]
          - generic [ref=e1256]:
            - img [ref=e1261]
            - generic [ref=e1265]:
              - generic [ref=e1266]: SSL incluido
              - generic [ref=e1267]: Certificado de seguridad
            - img [ref=e1269]
          - generic [ref=e1283]:
            - img [ref=e1288]
            - generic [ref=e1292]:
              - generic [ref=e1293]: 99.9% uptime
              - generic [ref=e1294]: Servidores confiables
            - img [ref=e1296]
          - generic [ref=e1310]:
            - img [ref=e1315]
            - generic [ref=e1321]:
              - generic [ref=e1322]: +500 usuarios
              - generic [ref=e1323]: Ya confían en nosotros
            - img [ref=e1325]
          - generic [ref=e1339]:
            - img [ref=e1344]
            - generic [ref=e1347]:
              - generic [ref=e1348]: 4.9/5 rating
              - generic [ref=e1349]: Calificación promedio
            - img [ref=e1351]
        - paragraph [ref=e1363]: Mas de 500 negocios argentinos ya confían en Maatwork
      - generic:
        - img
      - generic:
        - img
        - img
      - generic [ref=e1368]:
        - generic [ref=e1369]:
          - generic [ref=e1370]:
            - img [ref=e1371]
            - text: Precios
          - heading [level=2] [ref=e1374]: Tu app, a tu medida
          - paragraph [ref=e1375]: Cada proyecto es único. Cotizamos según tus necesidades específicas.
          - group [ref=e1376]:
            - button [pressed] [ref=e1377] [cursor=pointer]: Mensual
            - button [ref=e1378] [cursor=pointer]:
              - text: Anual
              - generic [ref=e1379]: "-20%"
        - generic [ref=e1388]:
          - generic [ref=e1394]:
            - img [ref=e1395]
            - generic [ref=e1397]: Más elegido
          - generic [ref=e1398]:
            - generic [ref=e1399]: App Completa
            - generic [ref=e1400]:
              - generic [ref=e1401]: $0
              - text: /mes
            - generic [ref=e1402]: Presupuesto personalizado según tu operación
          - list [ref=e1403]:
            - listitem [ref=e1404]:
              - img [ref=e1406]
              - generic [ref=e1409]: WhatsApp automático (cuotas, turnos)
            - listitem [ref=e1410]:
              - img [ref=e1412]
              - generic [ref=e1415]: Agenda de turnos / gestión de grupos
            - listitem [ref=e1416]:
              - img [ref=e1418]
              - generic [ref=e1421]: Gestión de clientes y membresías
            - listitem [ref=e1422]:
              - img [ref=e1424]
              - generic [ref=e1427]: Cobros online integrados
            - listitem [ref=e1428]:
              - img [ref=e1430]
              - generic [ref=e1433]: Panel avanzado con métricas del mes
            - listitem [ref=e1434]:
              - img [ref=e1436]
              - generic [ref=e1439]: Acceso multi-usuario con roles
            - listitem [ref=e1440]:
              - img [ref=e1442]
              - generic [ref=e1445]: Registro de asistentes
            - listitem [ref=e1446]:
              - img [ref=e1448]
              - generic [ref=e1451]: Tu marca, tu subdominio
            - listitem [ref=e1452]:
              - img [ref=e1454]
              - generic [ref=e1457]: Soporte prioritario incluido
          - button [ref=e1459] [cursor=pointer]:
            - generic [ref=e1460]:
              - text: Solicitar cotización
              - img [ref=e1461]
          - generic [ref=e1466]:
            - img [ref=e1467]
            - text: Garantía de 30 días
        - generic [ref=e1469]:
          - generic [ref=e1470]:
            - img [ref=e1472]
            - generic [ref=e1474]: Pago seguro
          - generic [ref=e1475]:
            - img [ref=e1477]
            - generic [ref=e1479]: Soporte dedicado
          - generic [ref=e1480]:
            - img [ref=e1482]
            - generic [ref=e1484]: Activación en 7-14 días
      - generic [ref=e1489]:
        - generic [ref=e1490]:
          - generic [ref=e1491]:
            - img [ref=e1492]
            - text: Calculadora de ROI
          - heading [level=2] [ref=e1494]: Descubri cuanto ahorraras
          - paragraph [ref=e1495]: Ajusta los parametros segun tu negocio y ve el impacto potencial
        - generic [ref=e1503]:
          - generic [ref=e1504]:
            - generic [ref=e1505]:
              - generic [ref=e1506]:
                - generic [ref=e1507]:
                  - img [ref=e1510]
                  - generic [ref=e1513]:
                    - generic [ref=e1514]: Horas diarias en tareas administrativas
                    - paragraph [ref=e1515]: Tiempo que dedicas a scheduling, cobros y WhatsApp manual
                - generic [ref=e1516]:
                  - generic [ref=e1517]: 3,0
                  - text: hrs/dia
              - slider [ref=e1518] [cursor=pointer]
              - generic [ref=e1522]:
                - generic [ref=e1523]: "1"
                - generic [ref=e1524]: "8"
            - generic [ref=e1525]:
              - generic [ref=e1526]:
                - generic [ref=e1527]:
                  - img [ref=e1530]
                  - generic [ref=e1533]:
                    - generic [ref=e1534]: Tarifa por hora de tu tiempo
                    - paragraph [ref=e1535]: Valor de tu hora de trabajo
                - generic [ref=e1536]:
                  - generic [ref=e1538]: $4.000
                  - text: ARS/hora
              - slider [ref=e1539] [cursor=pointer]
              - generic [ref=e1543]:
                - generic [ref=e1544]: $1.000
                - generic [ref=e1545]: $15.000
            - generic [ref=e1546]:
              - generic [ref=e1547]:
                - generic [ref=e1548]:
                  - img [ref=e1551]
                  - generic [ref=e1556]:
                    - generic [ref=e1557]: Dias lavorables por mes
                    - paragraph [ref=e1558]: Dias que trabajas activamente
                - generic [ref=e1559]:
                  - generic [ref=e1560]: "22"
                  - text: dias
              - slider [ref=e1561] [cursor=pointer]
              - generic [ref=e1565]:
                - generic [ref=e1566]: "20"
                - generic [ref=e1567]: "31"
          - generic [ref=e1570]:
            - generic [ref=e1571]:
              - generic [ref=e1572]:
                - generic [ref=e1573]: Tu ahorro mensual estimado
                - generic [ref=e1574]: $ 264.000
                - generic [ref=e1575]:
                  - img [ref=e1576]
                  - generic [ref=e1578]: +85% mas eficiente
              - generic [ref=e1580]:
                - generic [ref=e1581]:
                  - img [ref=e1583]
                  - generic [ref=e1587]:
                    - generic [ref=e1588]: 0%
                    - generic [ref=e1589]: eficiencia
                - generic [ref=e1590]: 56h saved
                - generic [ref=e1591]: Eficiencia
            - generic [ref=e1592]:
              - generic [ref=e1593]: Comparacion del flujo de trabajo
              - generic [ref=e1594]:
                - generic [ref=e1595]:
                  - generic [ref=e1596]: Antes
                  - generic [ref=e1597]: 66h
                  - generic [ref=e1598]: Horas administrativas/mes
                  - generic [ref=e1600]: X
                - generic [ref=e1601]:
                  - generic [ref=e1602]: Despues
                  - generic [ref=e1603]: 10h
                  - generic [ref=e1604]: Horas administrativas/mes
                  - img [ref=e1606]
            - generic [ref=e1608]:
              - img [ref=e1610]
              - generic [ref=e1614]: "Ahorro anual proyectado:"
              - generic [ref=e1616]: $3.168.000
          - generic [ref=e1617]:
            - button [ref=e1618]:
              - generic [ref=e1619]:
                - text: Comenzar ahora
                - img [ref=e1620]
            - button [ref=e1622]:
              - generic [ref=e1623]: Hablar con ventas
        - generic [ref=e1624]:
          - generic [ref=e1625]:
            - img [ref=e1626]
            - generic [ref=e1629]: Activacion en 7-14 dias
          - generic [ref=e1631]:
            - img [ref=e1632]
            - generic [ref=e1637]: +500 negocios automatizados
          - generic [ref=e1639]:
            - img [ref=e1640]
            - generic [ref=e1643]: Garantia de 30 dias
      - generic:
        - img
      - generic:
        - img
      - generic [ref=e1650]:
        - generic [ref=e1651]:
          - generic [ref=e1652]:
            - img [ref=e1653]
            - text: FAQ
          - heading [level=2] [ref=e1656]: Preguntas frecuentes
          - paragraph [ref=e1657]: Todo lo que necesitás saber antes de empezar
        - generic [ref=e1658]:
          - generic [ref=e1662]:
            - button [ref=e1664]:
              - generic [ref=e1665]: ¿Necesito conocimientos técnicos?
              - img [ref=e1666]
            - paragraph [ref=e1670]: No. Vos seguís operando tu negocio como siempre. Nosotros nos encargamos de toda la parte técnica y te entregamos una app lista para usar.
          - generic [ref=e1674]:
            - button [ref=e1676]:
              - generic [ref=e1677]: ¿Cuánto tiempo tarda en estar lista?
              - img [ref=e1678]
            - paragraph [ref=e1682]: Entre 7 y 14 días hábiles desde que nos pasás la info. El primer prototipo lo ves en 48 horas.
          - generic [ref=e1686]:
            - button [ref=e1688]:
              - generic [ref=e1689]: ¿Qué pasa si ya tengo un sistema?
              - img [ref=e1690]
            - paragraph [ref=e1694]: No hay problema. Migramos los datos y la integramos con lo que ya usás. Sin perder historial.
          - generic [ref=e1698]:
            - button [ref=e1700]:
              - generic [ref=e1701]: ¿Funciona en mi celular?
              - img [ref=e1702]
            - paragraph [ref=e1706]: "Sí. La app es responsive y funciona perfecto en cualquier dispositivo: celular, tablet o computadora."
          - generic [ref=e1710]:
            - button [ref=e1712]:
              - generic [ref=e1713]: ¿Qué incluye el precio?
              - img [ref=e1714]
            - paragraph [ref=e1718]: "Todo: la app, el dominio personalizado, WhatsApp automático, panel de métricas y soporte prioritario. Sin costos ocultos."
          - generic [ref=e1722]:
            - button [ref=e1724]:
              - generic [ref=e1725]: ¿Hay garantía?
              - img [ref=e1726]
            - paragraph [ref=e1730]: Sí. Si en 30 días no estás satisfecho, te devolvemos el dinero. Sin preguntas.
          - generic [ref=e1734]:
            - button [ref=e1736]:
              - generic [ref=e1737]: ¿Puedo personalizar el diseño?
              - img [ref=e1738]
            - paragraph [ref=e1742]: Sí. El diseño se adapta a tu marca. Colores, logo y estilo visual los configuramos juntos.
          - generic [ref=e1746]:
            - button [ref=e1748]:
              - generic [ref=e1749]: ¿Qué pasa si necesito cambios después?
              - img [ref=e1750]
            - paragraph [ref=e1754]: Incluye ajustes menores. Para cambios grandes, cotizamos por separado pero siempre con precios justos.
        - generic [ref=e1755]:
          - paragraph [ref=e1757]: ¿Tenés otra pregunta?
          - link [ref=e1758] [cursor=pointer]:
            - /url: "#contact"
            - img [ref=e1759]
            - text: Escribinos →
      - generic:
        - img
      - generic:
        - img
      - generic [ref=e1763]:
        - generic [ref=e1764]:
          - text: Empezá hoy
          - heading [level=2] [ref=e1765]: ¿Listo para que tu local funcione solo?
          - paragraph [ref=e1766]: Contanos de qué tipo de local se trata y en qué procesos necesitás ayuda.
        - generic [ref=e1768]:
          - generic [ref=e1770]:
            - generic [ref=e1771]: Completá tu consulta
            - generic [ref=e1772]: 0/4 campos
          - generic [ref=e1774]:
            - generic [ref=e1777]:
              - textbox [ref=e1778]
              - generic: Nombre completo
            - generic [ref=e1786]:
              - combobox [ref=e1787]
              - generic: Industria
              - generic:
                - img
          - generic [ref=e1789]:
            - generic [ref=e1792]:
              - textbox [ref=e1793]
              - generic: WhatsApp
              - generic:
                - img
            - generic [ref=e1801]:
              - textbox [ref=e1802]
              - generic: Email(opcional)
          - generic [ref=e1810]:
            - textbox [ref=e1811]
            - generic: Que proceso queres automatizar?
            - generic [ref=e1818]: 0/500
          - generic [ref=e1819]:
            - button [ref=e1820] [cursor=pointer]:
              - generic [ref=e1824]:
                - text: Enviar consulta
                - img [ref=e1825]
            - generic [ref=e1827]:
              - generic [ref=e1828]:
                - generic [ref=e1829]: Ctrl
                - generic [ref=e1830]: ↵
              - generic [ref=e1831]: para enviar
      - generic [ref=e1832]:
        - generic:
          - img
        - generic [ref=e1839]:
          - generic [ref=e1840]:
            - generic [ref=e1841]:
              - generic [ref=e1842]: MaatWork
              - paragraph [ref=e1843]:
                - text: Tu local, automatizado.
                - text: Tu app, lista para usar.
              - generic [ref=e1844]:
                - link "LinkedIn" [ref=e1845] [cursor=pointer]:
                  - /url: "#"
                  - img [ref=e1847]
                - link "Twitter" [ref=e1850] [cursor=pointer]:
                  - /url: "#"
                  - img [ref=e1852]
                - link "Instagram" [ref=e1855] [cursor=pointer]:
                  - /url: "#"
                  - img [ref=e1857]
            - generic [ref=e1860]:
              - heading "Producto" [level=4] [ref=e1861]
              - list [ref=e1862]:
                - listitem [ref=e1863]:
                  - link "Características" [ref=e1864] [cursor=pointer]:
                    - /url: "#features"
                    - generic [ref=e1866]: Características
                - listitem [ref=e1867]:
                  - link "Precios" [ref=e1868] [cursor=pointer]:
                    - /url: "#pricing"
                    - generic [ref=e1870]: Precios
                - listitem [ref=e1871]:
                  - link "Cómo funciona" [ref=e1872] [cursor=pointer]:
                    - /url: "#how-it-works"
                    - generic [ref=e1874]: Cómo funciona
            - generic [ref=e1875]:
              - heading "Empresa" [level=4] [ref=e1876]
              - list [ref=e1877]:
                - listitem [ref=e1878]:
                  - link "Testimonios" [ref=e1879] [cursor=pointer]:
                    - /url: "#testimonials"
                    - generic [ref=e1881]: Testimonios
                - listitem [ref=e1882]:
                  - link "Preguntas Frecuentes" [ref=e1883] [cursor=pointer]:
                    - /url: "#faq"
                    - generic [ref=e1885]: Preguntas Frecuentes
                - listitem [ref=e1886]:
                  - link "Contacto" [ref=e1887] [cursor=pointer]:
                    - /url: "#contact"
                    - generic [ref=e1889]: Contacto
            - generic [ref=e1890]:
              - heading "Contacto" [level=4] [ref=e1891]
              - list [ref=e1892]:
                - listitem [ref=e1893]:
                  - link "+54 299 456-9840" [ref=e1894] [cursor=pointer]:
                    - /url: tel:+542994569840
                    - img [ref=e1895]
                    - text: +54 299 456-9840
                - listitem [ref=e1897]:
                  - link "clientes@maat.work" [ref=e1898] [cursor=pointer]:
                    - /url: mailto:clientes@maat.work
                    - img [ref=e1899]
                    - text: clientes@maat.work
              - generic [ref=e1905]: Argentina, LATAM
          - img [ref=e1911]
          - generic [ref=e1913]:
            - paragraph [ref=e1914]: © 2026 MaatWork. Construido con determinación en Argentina para LATAM.
            - generic [ref=e1915]:
              - generic [ref=e1916]: Powered by
              - generic [ref=e1917]: Neon
              - generic [ref=e1918]: ·
              - generic [ref=e1919]: Vercel
      - button "Contactar por WhatsApp" [ref=e1924] [cursor=pointer]:
        - img [ref=e1931]
        - generic:
          - generic: Escribinos por WhatsApp
        - status [ref=e1933]: Abre WhatsApp para contactarnos
  - button "Open Next.js Dev Tools" [ref=e1939] [cursor=pointer]:
    - img [ref=e1940]
  - alert [ref=e1943]
  - generic "Social proof notifications"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | const breakpoints = [
  4  |   { name: 'Mobile 375px', width: 375, height: 812 },
  5  |   { name: 'Tablet 768px', width: 768, height: 1024 },
  6  |   { name: 'Desktop 1024px', width: 1024, height: 768 },
  7  |   { name: 'Large 1440px', width: 1440, height: 900 },
  8  | ]
  9  | 
  10 | for (const bp of breakpoints) {
  11 |   test.describe(`Pricing Section at ${bp.name}`, () => {
  12 |     test.beforeEach(async ({ page }) => {
  13 |       await page.setViewportSize({ width: bp.width, height: bp.height })
  14 |       await page.goto('http://localhost:3000')
  15 |       await page.evaluate(() => {
  16 |         document.querySelector('#pricing')?.scrollIntoView({ behavior: 'instant' })
  17 |       })
  18 |       await page.waitForTimeout(500)
  19 |     })
  20 | 
  21 |     test('pricing card layout', async ({ page }) => {
  22 |       const card = page.locator('#pricing .relative.group.spotlight-container').first()
  23 |       await expect(card).toBeVisible()
  24 | 
  25 |       const box = await card.boundingBox()
  26 |       console.log(`${bp.name}: Card bounding box:`, box)
  27 | 
  28 |       // Check card is not overflow
  29 |       const section = page.locator('#pricing')
  30 |       const sectionBox = await section.boundingBox()
  31 |       console.log(`${bp.name}: Section bounding box:`, sectionBox)
  32 |     })
  33 | 
  34 |     test('CTA button touch target', async ({ page }) => {
  35 |       const ctaButton = page.locator('#pricing button:has-text("Solicitar")').first()
  36 |       await expect(ctaButton).toBeVisible()
  37 | 
  38 |       const box = await ctaButton.boundingBox()
  39 |       console.log(`${bp.name}: CTA button bounding box:`, box)
  40 | 
  41 |       // Check minimum 44x44px touch target
  42 |       if (box) {
  43 |         expect(box.width).toBeGreaterThanOrEqual(44)
  44 |         expect(box.height).toBeGreaterThanOrEqual(44)
  45 |       }
  46 |     })
  47 | 
  48 |     test('price text contrast', async ({ page }) => {
  49 |       const priceText = page.locator('#pricing .font-display.text-6xl').first()
> 50 |       await expect(priceText).toBeVisible()
     |                               ^ Error: expect(locator).toBeVisible() failed
  51 | 
  52 |       const color = await priceText.evaluate(el => {
  53 |         const style = window.getComputedStyle(el)
  54 |         return style.color
  55 |       })
  56 |       console.log(`${bp.name}: Price text color:`, color)
  57 |     })
  58 | 
  59 |     test('feature list alignment', async ({ page }) => {
  60 |       const featureList = page.locator('#pricing ul.space-y-4').first()
  61 |       await expect(featureList).toBeVisible()
  62 | 
  63 |       const items = page.locator('#pricing ul.space-y-4 li').all()
  64 |       const count = await items.length
  65 |       console.log(`${bp.name}: Feature list items:`, count)
  66 | 
  67 |       for (let i = 0; i < Math.min(count, 3); i++) {
  68 |         const itemBox = await items[i].boundingBox()
  69 |         console.log(`${bp.name}: Feature item ${i} box:`, itemBox)
  70 |       }
  71 |     })
  72 | 
  73 |     test('toggle buttons accessibility', async ({ page }) => {
  74 |       const toggleGroup = page.locator('[role="group"][aria-label*="facturacion"]')
  75 |       await expect(toggleGroup).toBeVisible()
  76 | 
  77 |       const buttons = page.locator('[role="group"][aria-label*="facturacion"] button').all()
  78 |       for (const button of buttons) {
  79 |         const box = await button.boundingBox()
  80 |         console.log(`${bp.name}: Toggle button:`, box)
  81 |         if (box) {
  82 |           expect(box.height).toBeGreaterThanOrEqual(44)
  83 |         }
  84 |       }
  85 |     })
  86 |   })
  87 | }
  88 | 
```