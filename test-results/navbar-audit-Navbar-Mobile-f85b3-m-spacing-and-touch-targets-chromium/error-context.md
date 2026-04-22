# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navbar-audit.spec.ts >> Navbar Mobile Audit at 375px >> 3. Menu item spacing and touch targets
- Location: e2e/navbar-audit.spec.ts:48:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button[aria-label="Menu"]')
    - locator resolved to <button aria-label="Menu" aria-expanded="false" class="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-300 focus-ring cursor-pointer duration-300 bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">…</div> from <div class="entrance-banner">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">…</div> from <div class="entrance-banner">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    26 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div class="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">…</div> from <div class="entrance-banner">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms

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
            - heading "Deja de perder tiempo automatizando tu local. Hoy." [level=1] [ref=e100]:
              - generic [ref=e101]: Deja de perder tiempo
              - generic [ref=e103]: automatizando tu local.
              - generic [ref=e104]: Hoy.
            - paragraph [ref=e105]: La única plataforma que desarrolla tu app personalizada en 7-14 días. Clientes, cobros, turnos y WhatsApp automático — sin que vos hagas nada.
            - generic [ref=e106]:
              - button "Proba gratis 7 dias" [ref=e107] [cursor=pointer]:
                - generic [ref=e108]:
                  - text: Proba gratis 7 dias
                  - img [ref=e109]
              - button "Sin tarjeta · Sin compromiso" [ref=e111] [cursor=pointer]:
                - generic [ref=e112]: Sin tarjeta · Sin compromiso
            - generic [ref=e113]:
              - generic [ref=e114]:
                - generic [ref=e117]: 14-
                - generic [ref=e118]: Dias para tu app
              - generic [ref=e119]:
                - generic [ref=e122]: 3+
                - generic [ref=e123]: Rubros activos
              - generic [ref=e124]:
                - generic [ref=e125]: 24/7
                - generic [ref=e126]: Automatizacion
          - generic [ref=e127]:
            - generic [ref=e128]:
              - generic [ref=e130]: Natatorio
              - generic [ref=e131]: Grupos de Natacion · 42/50 asistentes
            - generic [ref=e132]:
              - generic [ref=e134]: Peluqueria
              - generic [ref=e135]: 15:30 Corte & Barba · 16:15 Color
            - generic [ref=e136]:
              - generic [ref=e138]: Academia
              - generic [ref=e139]: 128 Alumnos Activos
      - generic:
        - img
        - img
      - generic [ref=e147]:
        - generic [ref=e148]:
          - generic [ref=e151]: El problema real
          - heading [level=2] [ref=e153]: ¿Seguir perdendo clientes, dinero y tiempo?
          - paragraph [ref=e154]: El 78% de los negocios en Argentina siguen administrando con papel, WhatsApp y Excel. Perdiendo en promedio $120.000/mes en oportunidades.
        - generic [ref=e155]:
          - generic [ref=e158]:
            - img [ref=e161]
            - img [ref=e164]
            - generic [ref=e166]:
              - img [ref=e169]
              - generic [ref=e172]:
                - generic [ref=e173]:
                  - heading [level=3] [ref=e174]: Sin MaatWork
                  - generic [ref=e175]: Perdidas
                - paragraph [ref=e176]: La realidad de la mayoria
            - list [ref=e177]:
              - listitem [ref=e178]:
                - generic [ref=e181]:
                  - img [ref=e184]
                  - generic [ref=e187]:
                    - generic [ref=e188]: Gestion manual de turnos que consume horas
                    - generic [ref=e189]: "-2hrs/dia"
                  - img [ref=e191]
              - listitem [ref=e195]:
                - generic [ref=e198]:
                  - img [ref=e201]
                  - generic [ref=e206]:
                    - generic [ref=e207]: 30% de clientes olvidan sus turnos
                    - generic [ref=e208]: "-$50K/mes"
                  - img [ref=e210]
              - listitem [ref=e214]:
                - generic [ref=e217]:
                  - img [ref=e220]
                  - generic [ref=e223]:
                    - generic [ref=e224]: Cobros que se vencen y nunca llegan
                    - generic [ref=e225]: "-15% ingresos"
                  - img [ref=e227]
              - listitem [ref=e231]:
                - generic [ref=e234]:
                  - img [ref=e237]
                  - generic [ref=e241]:
                    - generic [ref=e242]: WhatsApp saturado de mensajes repetitivos
                    - generic [ref=e243]: "-3hrs/dia"
                  - img [ref=e245]
            - generic [ref=e250]:
              - generic [ref=e251]: Perdida mensual estimada
              - generic [ref=e252]: $120.000+
          - generic [ref=e264]:
            - img [ref=e267]
            - generic [ref=e270]:
              - img [ref=e273]
              - generic [ref=e277]:
                - generic [ref=e278]:
                  - heading [level=3] [ref=e279]: Con MaatWork
                  - generic [ref=e280]:
                    - img [ref=e281]
                    - text: Ganancias
                - paragraph [ref=e284]: La transformacion que necesitas
            - list [ref=e285]:
              - listitem [ref=e286]:
                - generic [ref=e289]:
                  - img [ref=e292]
                  - generic [ref=e295]:
                    - generic [ref=e296]: Agenda automatica que se llena sola
                    - generic [ref=e297]:
                      - generic [ref=e298]: +40%
                      - generic [ref=e300]: mas clientes
                  - img [ref=e301]
              - listitem [ref=e304]:
                - generic [ref=e307]:
                  - img [ref=e310]
                  - generic [ref=e315]:
                    - generic [ref=e316]: Recordatorios por WhatsApp personalizados
                    - generic [ref=e317]:
                      - generic [ref=e318]: "0"
                      - generic [ref=e320]: cancelaciones
                  - img [ref=e321]
              - listitem [ref=e324]:
                - generic [ref=e327]:
                  - img [ref=e330]
                  - generic [ref=e332]:
                    - generic [ref=e333]: Cobros con un clic y seguimiento automatico
                    - generic [ref=e334]:
                      - generic [ref=e335]: +25%
                      - generic [ref=e337]: cobro efectivo
                  - img [ref=e338]
              - listitem [ref=e341]:
                - generic [ref=e344]:
                  - img [ref=e347]
                  - generic [ref=e350]:
                    - generic [ref=e351]: Respuestas automaticas 24/7
                    - generic [ref=e352]:
                      - generic [ref=e353]: +2hrs
                      - generic [ref=e355]: libres diario
                  - img [ref=e356]
            - generic [ref=e360]:
              - generic [ref=e361]: Recuperacion de ingresos
              - generic [ref=e362]: +40%
        - generic [ref=e363]:
          - generic [ref=e365]: Comparacion visual
          - generic [ref=e368]:
            - generic [ref=e370]:
              - img [ref=e372]
              - generic [ref=e376]: SIN MaatWork
              - generic [ref=e377]: Administracion manual, perdidas, caos
              - generic [ref=e381]: 85% ineficiente
            - generic [ref=e384]:
              - img [ref=e386]
              - generic [ref=e389]: CON MaatWork
              - generic [ref=e390]: Automatizacion inteligente, crecimiento
              - generic [ref=e394]: 95% eficiente
            - generic [ref=e398]:
              - img [ref=e399]
              - img [ref=e401]
            - generic [ref=e403]: ANTES
            - generic [ref=e404]: DESPUES
          - paragraph [ref=e405]: Arrastra el control para comparar
        - generic [ref=e407]:
          - generic [ref=e408]:
            - generic [ref=e409]: SIN
            - generic [ref=e410]: —
            - generic [ref=e411]: Perdidas, caos, stress
          - img [ref=e414]
          - generic [ref=e416]:
            - generic [ref=e417]: CON
            - generic [ref=e418]: —
            - generic [ref=e419]: Crecimiento, orden, libertad
      - region [ref=e421]:
        - generic [ref=e423]:
          - generic [ref=e424]:
            - generic [ref=e425]: Funcionalidades
            - heading [level=2] [ref=e428]: Una app que trabaja por vos, 24/7
            - paragraph [ref=e429]: Todo lo que necesitas para automatizar tu negocio y recuperar tiempo libre
          - generic [ref=e430]:
            - button [ref=e431] [cursor=pointer]:
              - generic [ref=e434]:
                - img [ref=e436]
                - generic [ref=e441]:
                  - heading [level=3] [ref=e442]: Gestion de Clientes
                  - paragraph [ref=e443]: "Cada cliente tiene su ficha digital: datos de contacto, membresia, asistencia e historial completo."
                - generic [ref=e445]:
                  - img [ref=e446]
                  - text: Premium
            - button [ref=e450] [cursor=pointer]:
              - generic [ref=e453]:
                - img [ref=e455]
                - generic [ref=e457]:
                  - heading [level=3] [ref=e458]: Cobros y Cuotas
                  - paragraph [ref=e459]: Registra cobros y deja que la app maneje los recordatorios de pago automaticamente.
            - button [ref=e461] [cursor=pointer]:
              - generic [ref=e464]:
                - img [ref=e466]
                - generic [ref=e468]:
                  - heading [level=3] [ref=e469]: Turnos y Clases
                  - paragraph [ref=e470]: Organiza grupos o turnos con horarios y capacidades. Sin confusiones ni overlaps.
            - button [ref=e472] [cursor=pointer]:
              - generic [ref=e475]:
                - img [ref=e477]
                - generic [ref=e479]:
                  - heading [level=3] [ref=e480]: WhatsApp Automatico
                  - paragraph [ref=e481]: Mensajes automaticos sin que hagas nada. Confirmar turnos, avisar cuotas pendientes.
            - button [ref=e483] [cursor=pointer]:
              - generic [ref=e486]:
                - img [ref=e488]
                - generic [ref=e490]:
                  - heading [level=3] [ref=e491]: Panel para el Dueno
                  - paragraph [ref=e492]: Entras al panel y en 10 segundos sabes como viene el mes. Sin pedirle nada a nadie.
            - button [ref=e494] [cursor=pointer]:
              - generic [ref=e497]:
                - img [ref=e499]
                - generic [ref=e502]:
                  - heading [level=3] [ref=e503]: Hecha a Medida
                  - paragraph [ref=e504]: No es generica. Disenamos la app para tus procesos especificos desde cero.
      - generic [ref=e528]:
        - generic [ref=e529]:
          - generic [ref=e532]: Transformacion Real
          - heading [level=2] [ref=e534]:
            - text: De perder clientes a
            - generic [ref=e535]: crecer 40%
            - text: en 3 meses
          - paragraph [ref=e537]: Mira la diferencia entre gestionar tu negocio con metodos tradicionales vs. con MaatWork
        - switch [ref=e539] [cursor=pointer]:
          - generic [ref=e542]:
            - img [ref=e543]
            - generic [ref=e547]: Antes
          - generic [ref=e549]:
            - img [ref=e550]
            - generic [ref=e553]: Despues
        - generic [ref=e554]:
          - generic [ref=e555]:
            - generic [ref=e559]:
              - img [ref=e562]
              - generic [ref=e566]: SIN MaatWork
              - generic [ref=e567]: Administracion manual, caos y perdidas
            - generic [ref=e571]:
              - img [ref=e574]
              - generic [ref=e577]: CON MaatWork
              - generic [ref=e578]: Automatizacion inteligente y crecimiento
            - generic [ref=e582]:
              - img [ref=e583]
              - img [ref=e585]
            - generic [ref=e587]: ANTES
            - generic [ref=e588]: DESPUES
          - generic [ref=e590]:
            - generic [ref=e591]:
              - img [ref=e593]
              - generic [ref=e596]:
                - generic [ref=e597]: Metricas Clave
                - generic [ref=e598]: Lo que cambia con MaatWork
            - generic [ref=e599]:
              - generic [ref=e601]:
                - generic [ref=e602]:
                  - img [ref=e605]
                  - generic [ref=e608]:
                    - generic [ref=e609]: Horas de administracion
                    - generic [ref=e610]: Tiempo dedicado a tareas administrativas
                - generic [ref=e613]: 10 hrs/semana
              - generic [ref=e618]:
                - generic [ref=e619]:
                  - img [ref=e622]
                  - generic [ref=e624]:
                    - generic [ref=e625]: Cobros perdidos
                    - generic [ref=e626]: Ingresos que se escapan por falta de seguimiento
                - generic [ref=e629]: 15 % mensual
              - generic [ref=e634]:
                - generic [ref=e635]:
                  - img [ref=e638]
                  - generic [ref=e643]:
                    - generic [ref=e644]: Clientes activos
                    - generic [ref=e645]: Capacidad de gestionar tu base de clientes
                - generic [ref=e647]: "60"
              - generic [ref=e652]:
                - generic [ref=e653]:
                  - img [ref=e656]
                  - generic [ref=e658]:
                    - generic [ref=e659]: Respuestas a WhatsApp
                    - generic [ref=e660]: Mensajes manuales que tenes que responder
                - generic [ref=e663]: 50 /dia
        - generic [ref=e667]:
          - generic [ref=e668]:
            - heading [level=3] [ref=e669]: Los problemas de no tener app
            - paragraph [ref=e670]: Cada hora que pasa sin un sistema es dinero que se pierde
          - generic [ref=e671]:
            - generic [ref=e673]:
              - img [ref=e678]
              - generic [ref=e685]:
                - heading [level=4] [ref=e686]: Sin sistema
                - paragraph [ref=e687]: Todo en papel o planillas de Excel desactualizadas
            - generic [ref=e689]:
              - img [ref=e694]
              - generic [ref=e700]:
                - heading [level=4] [ref=e701]: Perdida de tiempo
                - paragraph [ref=e702]: 3-4 horas diarias en tareas administrativas
            - generic [ref=e704]:
              - img [ref=e709]
              - generic [ref=e716]:
                - heading [level=4] [ref=e717]: Sin control
                - paragraph [ref=e718]: No sabes que entra y que sale todos los dias
        - generic [ref=e719]:
          - generic [ref=e721]:
            - generic [ref=e722]:
              - img [ref=e725]
              - generic [ref=e728]:
                - generic [ref=e729]: Semana 1-2
                - generic [ref=e730]: Diagnostico y diseno
                - generic [ref=e731]: Analizamos tu negocio y disenamos la app a tu medida
            - generic [ref=e732]:
              - img [ref=e735]
              - generic [ref=e740]:
                - generic [ref=e741]: Semana 2-3
                - generic [ref=e742]: Desarrollo
                - generic [ref=e743]: Programamos tu app con todas las funcionalidades
            - generic [ref=e744]:
              - img [ref=e746]
              - generic [ref=e750]:
                - generic [ref=e751]: Semana 3-4
                - generic [ref=e752]: Pruebas y lanzamiento
                - generic [ref=e753]: Testeamos juntos que todo funcione perfecto
          - generic [ref=e754]:
            - button [ref=e755] [cursor=pointer]:
              - generic [ref=e757]:
                - text: Quiero cambiar mi negocio
                - img [ref=e758]
            - paragraph [ref=e761]: Sin tarjeta · Sin compromiso · En 7-14 dias tenes tu app
      - generic [ref=e764]:
        - generic [ref=e765]:
          - generic [ref=e766]: El proceso
          - heading [level=2] [ref=e768]: Tu app lista en dias, no en meses
          - paragraph [ref=e769]: Solo 3 pasos para tener tu propia app funcionando
        - generic [ref=e770]:
          - generic [ref=e772]:
            - img [ref=e779]
            - generic [ref=e783]: "01"
            - heading [level=3] [ref=e785]: Diagnostico
            - paragraph [ref=e786]: Contanos tu situacion y besoins. Analizamos tus procesos y disenamos la solucion perfecta.
          - generic [ref=e791]:
            - img [ref=e798]
            - generic [ref=e802]: "02"
            - heading [level=3] [ref=e804]: Prototipo
            - paragraph [ref=e805]: Te mostarmos una idea clara en 48hs. Ves exactamente como va a funcionar tu app.
          - generic [ref=e810]:
            - img [ref=e817]
            - generic [ref=e821]: "03"
            - heading [level=3] [ref=e823]: Launch
            - paragraph [ref=e824]: Tu app lista en 7-14 dias. Deployment automatico y soporte incluido.
        - generic [ref=e829]:
          - img [ref=e831]
          - generic [ref=e834]: "Tiempo promedio de entrega: 7 a 14 dias habiles"
      - generic [ref=e842]:
        - generic [ref=e843]:
          - generic [ref=e844]:
            - img [ref=e845]
            - text: Testimonios
            - img [ref=e847]
          - heading [level=2] [ref=e849]: Ya lo están usando
          - paragraph [ref=e850]: Negocios como el tuyo que ya automatizaron sus procesos
        - generic [ref=e851]:
          - generic [ref=e852]:
            - generic [ref=e856]:
              - generic [ref=e857]:
                - img [ref=e858]
                - img [ref=e860]
                - img [ref=e862]
                - img [ref=e864]
                - img [ref=e866]
              - blockquote [ref=e868]: “Pasamos de perder el 30% de los clientes por olvido a tener 0 cancelaciones. El WhatsApp automático cambió todo.”
              - generic [ref=e869]:
                - generic [ref=e870]:
                  - generic [ref=e871]: MR
                  - generic [ref=e872]:
                    - generic [ref=e873]: Martin Rodriguez
                    - generic [ref=e874]: Natatorio Acuática
                - generic [ref=e875]: +40% retención
            - generic [ref=e879]:
              - generic [ref=e880]:
                - img [ref=e881]
                - img [ref=e883]
                - img [ref=e885]
                - img [ref=e887]
                - img [ref=e889]
              - blockquote [ref=e891]: “Mi agenda ahora se llena sola. Los clientes confirman turnos por WhatsApp y yo solo me-focus en cortar.”
              - generic [ref=e892]:
                - generic [ref=e893]:
                  - generic [ref=e894]: LM
                  - generic [ref=e895]:
                    - generic [ref=e896]: Laura Mendes
                    - generic [ref=e897]: Peluquería Color
                - generic [ref=e898]: +60% eficiencia
            - generic [ref=e902]:
              - generic [ref=e903]:
                - img [ref=e904]
                - img [ref=e906]
                - img [ref=e908]
                - img [ref=e910]
                - img [ref=e912]
              - blockquote [ref=e914]: “Cobrar cuotas era un dolor de cabeza. Ahora con un clic mando recordatorios y cobros. Tiempo解放.”
              - generic [ref=e915]:
                - generic [ref=e916]:
                  - generic [ref=e917]: DF
                  - generic [ref=e918]:
                    - generic [ref=e919]: Diego Fernandez
                    - generic [ref=e920]: Gimnasio PowerFit
                - generic [ref=e921]: +25% cobranzas
            - generic [ref=e925]:
              - generic [ref=e926]:
                - img [ref=e927]
                - img [ref=e929]
                - img [ref=e931]
                - img [ref=e933]
                - img [ref=e935]
              - blockquote [ref=e937]: “Los pedidos por WhatsApp se gestionan solos. Ya no pierdo horas respondiendo mensajes, puedo enfocarme en hornear.”
              - generic [ref=e938]:
                - generic [ref=e939]:
                  - generic [ref=e940]: CR
                  - generic [ref=e941]:
                    - generic [ref=e942]: Carmen Ruiz
                    - generic [ref=e943]: Panadería Delicia
                - generic [ref=e944]: +80% pedidos
            - generic [ref=e948]:
              - generic [ref=e949]:
                - img [ref=e950]
                - img [ref=e952]
                - img [ref=e954]
                - img [ref=e956]
                - img [ref=e958]
              - blockquote [ref=e960]: “La app me permite mostrar el catálogo de trabajos a clientes nuevos. Cierro trabajos solo con enviar un link.”
              - generic [ref=e961]:
                - generic [ref=e962]:
                  - generic [ref=e963]: GH
                  - generic [ref=e964]:
                    - generic [ref=e965]: Gustavo Herrera
                    - generic [ref=e966]: Herrería Industrial
                - generic [ref=e967]: +50% clientes
            - generic [ref=e971]:
              - generic [ref=e972]:
                - img [ref=e973]
                - img [ref=e975]
                - img [ref=e977]
                - img [ref=e979]
                - img [ref=e981]
              - blockquote [ref=e983]: “Gestiono audiencias y recordatorios desde la app. Mis clientes reciben alertas automáticas. Menos olvidos, más confianza.”
              - generic [ref=e984]:
                - generic [ref=e985]:
                  - generic [ref=e986]: AV
                  - generic [ref=e987]:
                    - generic [ref=e988]: Ana Lucia Vega
                    - generic [ref=e989]: Estudio Jurídico
                - generic [ref=e990]: +35% puntualidad
            - generic [ref=e992]:
              - generic [ref=e994]:
                - img [ref=e995]
                - img [ref=e998]
                - generic [ref=e1000]: 1:24
                - button [ref=e1001] [cursor=pointer]
              - generic [ref=e1003]:
                - generic [ref=e1004]:
                  - generic [ref=e1005]: MF
                  - generic [ref=e1006]:
                    - generic [ref=e1007]: Maria Fernandez
                    - generic [ref=e1008]: Centro de Estética Bella
                - generic [ref=e1009]:
                  - img [ref=e1010]
                  - generic [ref=e1012]: Video
            - generic [ref=e1014]:
              - generic [ref=e1016]:
                - img [ref=e1017]
                - img [ref=e1020]
                - generic [ref=e1022]: 2:05
                - button [ref=e1023] [cursor=pointer]
              - generic [ref=e1025]:
                - generic [ref=e1026]:
                  - generic [ref=e1027]: CM
                  - generic [ref=e1028]:
                    - generic [ref=e1029]: Carlos Mendoza
                    - generic [ref=e1030]: Consultorio Dental Sonrisa
                - generic [ref=e1031]:
                  - img [ref=e1032]
                  - generic [ref=e1034]: Video
          - generic [ref=e1035]:
            - button [ref=e1036]
            - button [ref=e1037]
            - button [ref=e1038]
            - button [ref=e1039]
            - button [ref=e1040]
            - button [ref=e1041]
            - button [ref=e1042]
            - button [ref=e1043]
          - generic [ref=e1045]: 01 / 08
      - generic [ref=e1050]:
        - generic [ref=e1051]:
          - generic [ref=e1052]:
            - generic [ref=e1053]: 0+
            - generic [ref=e1054]: Apps entregadas
          - generic [ref=e1055]:
            - generic [ref=e1056]: 0%
            - generic [ref=e1057]: Clientes satisfechos
          - generic [ref=e1058]:
            - generic [ref=e1059]: "0"
            - generic [ref=e1060]: Días máx. entrega
          - generic [ref=e1061]:
            - generic [ref=e1062]: 0/7
            - generic [ref=e1063]: Soporte
        - generic [ref=e1065]:
          - generic [ref=e1067]: Trusted by industry leaders
          - generic [ref=e1069]:
            - generic [ref=e1073] [cursor=pointer]: TechCorp
            - generic [ref=e1077] [cursor=pointer]: Innovate
            - generic [ref=e1081] [cursor=pointer]: Digital
            - generic [ref=e1085] [cursor=pointer]: CloudBase
            - generic [ref=e1091] [cursor=pointer]: DataPro
            - generic [ref=e1095] [cursor=pointer]: NextGen
            - generic [ref=e1101] [cursor=pointer]: SmartStack
            - generic [ref=e1106] [cursor=pointer]: AIVenture
            - generic [ref=e1110] [cursor=pointer]: TechCorp
            - generic [ref=e1114] [cursor=pointer]: Innovate
            - generic [ref=e1118] [cursor=pointer]: Digital
            - generic [ref=e1122] [cursor=pointer]: CloudBase
            - generic [ref=e1128] [cursor=pointer]: DataPro
            - generic [ref=e1132] [cursor=pointer]: NextGen
            - generic [ref=e1138] [cursor=pointer]: SmartStack
            - generic [ref=e1143] [cursor=pointer]: AIVenture
        - generic [ref=e1144]:
          - generic [ref=e1148]:
            - img [ref=e1153]
            - generic [ref=e1156]:
              - generic [ref=e1157]: Datos seguros
              - generic [ref=e1158]: Encriptación de grado bancario
            - img [ref=e1160]
          - generic [ref=e1174]:
            - img [ref=e1179]
            - generic [ref=e1182]:
              - generic [ref=e1183]: Activación rápida
              - generic [ref=e1184]: Tu app en 7-14 días
            - img [ref=e1186]
          - generic [ref=e1200]:
            - img [ref=e1205]
            - generic [ref=e1208]:
              - generic [ref=e1209]: Soporte dedicado
              - generic [ref=e1210]: Te acompañamos siempre
            - img [ref=e1212]
          - generic [ref=e1226]:
            - img [ref=e1231]
            - generic [ref=e1235]:
              - generic [ref=e1236]: Garantía 30 días
              - generic [ref=e1237]: Si no funciona, te devolvemos
            - img [ref=e1239]
          - generic [ref=e1253]:
            - img [ref=e1258]
            - generic [ref=e1262]:
              - generic [ref=e1263]: SSL incluido
              - generic [ref=e1264]: Certificado de seguridad
            - img [ref=e1266]
          - generic [ref=e1280]:
            - img [ref=e1285]
            - generic [ref=e1289]:
              - generic [ref=e1290]: 99.9% uptime
              - generic [ref=e1291]: Servidores confiables
            - img [ref=e1293]
          - generic [ref=e1307]:
            - img [ref=e1312]
            - generic [ref=e1318]:
              - generic [ref=e1319]: +500 usuarios
              - generic [ref=e1320]: Ya confían en nosotros
            - img [ref=e1322]
          - generic [ref=e1336]:
            - img [ref=e1341]
            - generic [ref=e1344]:
              - generic [ref=e1345]: 4.9/5 rating
              - generic [ref=e1346]: Calificación promedio
            - img [ref=e1348]
        - paragraph [ref=e1360]: Mas de 500 negocios argentinos ya confían en Maatwork
      - generic:
        - img
      - generic:
        - img
        - img
      - generic [ref=e1365]:
        - generic [ref=e1366]:
          - generic [ref=e1367]:
            - img [ref=e1368]
            - text: Precios
          - heading [level=2] [ref=e1371]: Tu app, a tu medida
          - paragraph [ref=e1372]: Cada proyecto es único. Cotizamos según tus necesidades específicas.
          - group [ref=e1373]:
            - button [pressed] [ref=e1374] [cursor=pointer]: Mensual
            - button [ref=e1375] [cursor=pointer]:
              - text: Anual
              - generic [ref=e1376]: "-20%"
        - generic [ref=e1385]:
          - generic [ref=e1391]:
            - img [ref=e1392]
            - generic [ref=e1394]: Más elegido
          - generic [ref=e1395]:
            - generic [ref=e1396]: App Completa
            - generic [ref=e1397]:
              - generic [ref=e1398]: $0
              - text: /mes
            - generic [ref=e1399]: Presupuesto personalizado según tu operación
          - list [ref=e1400]:
            - listitem [ref=e1401]:
              - img [ref=e1403]
              - generic [ref=e1406]: WhatsApp automático (cuotas, turnos)
            - listitem [ref=e1407]:
              - img [ref=e1409]
              - generic [ref=e1412]: Agenda de turnos / gestión de grupos
            - listitem [ref=e1413]:
              - img [ref=e1415]
              - generic [ref=e1418]: Gestión de clientes y membresías
            - listitem [ref=e1419]:
              - img [ref=e1421]
              - generic [ref=e1424]: Cobros online integrados
            - listitem [ref=e1425]:
              - img [ref=e1427]
              - generic [ref=e1430]: Panel avanzado con métricas del mes
            - listitem [ref=e1431]:
              - img [ref=e1433]
              - generic [ref=e1436]: Acceso multi-usuario con roles
            - listitem [ref=e1437]:
              - img [ref=e1439]
              - generic [ref=e1442]: Registro de asistentes
            - listitem [ref=e1443]:
              - img [ref=e1445]
              - generic [ref=e1448]: Tu marca, tu subdominio
            - listitem [ref=e1449]:
              - img [ref=e1451]
              - generic [ref=e1454]: Soporte prioritario incluido
          - button [ref=e1456] [cursor=pointer]:
            - generic [ref=e1457]:
              - text: Solicitar cotización
              - img [ref=e1458]
          - generic [ref=e1463]:
            - img [ref=e1464]
            - text: Garantía de 30 días
        - generic [ref=e1466]:
          - generic [ref=e1467]:
            - img [ref=e1469]
            - generic [ref=e1471]: Pago seguro
          - generic [ref=e1472]:
            - img [ref=e1474]
            - generic [ref=e1476]: Soporte dedicado
          - generic [ref=e1477]:
            - img [ref=e1479]
            - generic [ref=e1481]: Activación en 7-14 días
      - generic [ref=e1486]:
        - generic [ref=e1487]:
          - generic [ref=e1488]:
            - img [ref=e1489]
            - text: Calculadora de ROI
          - heading [level=2] [ref=e1491]: Descubri cuanto ahorraras
          - paragraph [ref=e1492]: Ajusta los parametros segun tu negocio y ve el impacto potencial
        - generic [ref=e1500]:
          - generic [ref=e1501]:
            - generic [ref=e1502]:
              - generic [ref=e1503]:
                - generic [ref=e1504]:
                  - img [ref=e1507]
                  - generic [ref=e1510]:
                    - generic [ref=e1511]: Horas diarias en tareas administrativas
                    - paragraph [ref=e1512]: Tiempo que dedicas a scheduling, cobros y WhatsApp manual
                - generic [ref=e1513]:
                  - generic [ref=e1514]: 3,0
                  - text: hrs/dia
              - slider [ref=e1515] [cursor=pointer]
              - generic [ref=e1519]:
                - generic [ref=e1520]: "1"
                - generic [ref=e1521]: "8"
            - generic [ref=e1522]:
              - generic [ref=e1523]:
                - generic [ref=e1524]:
                  - img [ref=e1527]
                  - generic [ref=e1530]:
                    - generic [ref=e1531]: Tarifa por hora de tu tiempo
                    - paragraph [ref=e1532]: Valor de tu hora de trabajo
                - generic [ref=e1533]:
                  - generic [ref=e1535]: $4.000
                  - text: ARS/hora
              - slider [ref=e1536] [cursor=pointer]
              - generic [ref=e1540]:
                - generic [ref=e1541]: $1.000
                - generic [ref=e1542]: $15.000
            - generic [ref=e1543]:
              - generic [ref=e1544]:
                - generic [ref=e1545]:
                  - img [ref=e1548]
                  - generic [ref=e1553]:
                    - generic [ref=e1554]: Dias lavorables por mes
                    - paragraph [ref=e1555]: Dias que trabajas activamente
                - generic [ref=e1556]:
                  - generic [ref=e1557]: "22"
                  - text: dias
              - slider [ref=e1558] [cursor=pointer]
              - generic [ref=e1562]:
                - generic [ref=e1563]: "20"
                - generic [ref=e1564]: "31"
          - generic [ref=e1567]:
            - generic [ref=e1568]:
              - generic [ref=e1569]:
                - generic [ref=e1570]: Tu ahorro mensual estimado
                - generic [ref=e1571]: $ 264.000
                - generic [ref=e1572]:
                  - img [ref=e1573]
                  - generic [ref=e1575]: +85% mas eficiente
              - generic [ref=e1577]:
                - generic [ref=e1578]:
                  - img [ref=e1580]
                  - generic [ref=e1584]:
                    - generic [ref=e1585]: 0%
                    - generic [ref=e1586]: eficiencia
                - generic [ref=e1587]: 56h saved
                - generic [ref=e1588]: Eficiencia
            - generic [ref=e1589]:
              - generic [ref=e1590]: Comparacion del flujo de trabajo
              - generic [ref=e1591]:
                - generic [ref=e1592]:
                  - generic [ref=e1593]: Antes
                  - generic [ref=e1594]: 66h
                  - generic [ref=e1595]: Horas administrativas/mes
                  - generic [ref=e1597]: X
                - generic [ref=e1598]:
                  - generic [ref=e1599]: Despues
                  - generic [ref=e1600]: 10h
                  - generic [ref=e1601]: Horas administrativas/mes
                  - img [ref=e1603]
            - generic [ref=e1605]:
              - img [ref=e1607]
              - generic [ref=e1611]: "Ahorro anual proyectado:"
              - generic [ref=e1613]: $3.168.000
          - generic [ref=e1614]:
            - button [ref=e1615]:
              - generic [ref=e1616]:
                - text: Comenzar ahora
                - img [ref=e1617]
            - button [ref=e1619]:
              - generic [ref=e1620]: Hablar con ventas
        - generic [ref=e1621]:
          - generic [ref=e1622]:
            - img [ref=e1623]
            - generic [ref=e1626]: Activacion en 7-14 dias
          - generic [ref=e1628]:
            - img [ref=e1629]
            - generic [ref=e1634]: +500 negocios automatizados
          - generic [ref=e1636]:
            - img [ref=e1637]
            - generic [ref=e1640]: Garantia de 30 dias
      - generic:
        - img
      - generic:
        - img
      - generic [ref=e1647]:
        - generic [ref=e1648]:
          - generic [ref=e1649]:
            - img [ref=e1650]
            - text: FAQ
          - heading [level=2] [ref=e1653]: Preguntas frecuentes
          - paragraph [ref=e1654]: Todo lo que necesitás saber antes de empezar
        - generic [ref=e1655]:
          - generic [ref=e1659]:
            - button [ref=e1661]:
              - generic [ref=e1662]: ¿Necesito conocimientos técnicos?
              - img [ref=e1663]
            - paragraph [ref=e1667]: No. Vos seguís operando tu negocio como siempre. Nosotros nos encargamos de toda la parte técnica y te entregamos una app lista para usar.
          - generic [ref=e1671]:
            - button [ref=e1673]:
              - generic [ref=e1674]: ¿Cuánto tiempo tarda en estar lista?
              - img [ref=e1675]
            - paragraph [ref=e1679]: Entre 7 y 14 días hábiles desde que nos pasás la info. El primer prototipo lo ves en 48 horas.
          - generic [ref=e1683]:
            - button [ref=e1685]:
              - generic [ref=e1686]: ¿Qué pasa si ya tengo un sistema?
              - img [ref=e1687]
            - paragraph [ref=e1691]: No hay problema. Migramos los datos y la integramos con lo que ya usás. Sin perder historial.
          - generic [ref=e1695]:
            - button [ref=e1697]:
              - generic [ref=e1698]: ¿Funciona en mi celular?
              - img [ref=e1699]
            - paragraph [ref=e1703]: "Sí. La app es responsive y funciona perfecto en cualquier dispositivo: celular, tablet o computadora."
          - generic [ref=e1707]:
            - button [ref=e1709]:
              - generic [ref=e1710]: ¿Qué incluye el precio?
              - img [ref=e1711]
            - paragraph [ref=e1715]: "Todo: la app, el dominio personalizado, WhatsApp automático, panel de métricas y soporte prioritario. Sin costos ocultos."
          - generic [ref=e1719]:
            - button [ref=e1721]:
              - generic [ref=e1722]: ¿Hay garantía?
              - img [ref=e1723]
            - paragraph [ref=e1727]: Sí. Si en 30 días no estás satisfecho, te devolvemos el dinero. Sin preguntas.
          - generic [ref=e1731]:
            - button [ref=e1733]:
              - generic [ref=e1734]: ¿Puedo personalizar el diseño?
              - img [ref=e1735]
            - paragraph [ref=e1739]: Sí. El diseño se adapta a tu marca. Colores, logo y estilo visual los configuramos juntos.
          - generic [ref=e1743]:
            - button [ref=e1745]:
              - generic [ref=e1746]: ¿Qué pasa si necesito cambios después?
              - img [ref=e1747]
            - paragraph [ref=e1751]: Incluye ajustes menores. Para cambios grandes, cotizamos por separado pero siempre con precios justos.
        - generic [ref=e1752]:
          - paragraph [ref=e1754]: ¿Tenés otra pregunta?
          - link [ref=e1755] [cursor=pointer]:
            - /url: "#contact"
            - img [ref=e1756]
            - text: Escribinos →
      - generic:
        - img
      - generic:
        - img
      - generic [ref=e1760]:
        - generic [ref=e1761]:
          - text: Empezá hoy
          - heading [level=2] [ref=e1762]: ¿Listo para que tu local funcione solo?
          - paragraph [ref=e1763]: Contanos de qué tipo de local se trata y en qué procesos necesitás ayuda.
        - generic [ref=e1765]:
          - generic [ref=e1767]:
            - generic [ref=e1768]: Completá tu consulta
            - generic [ref=e1769]: 0/4 campos
          - generic [ref=e1771]:
            - generic [ref=e1774]:
              - textbox [ref=e1775]
              - generic: Nombre completo
            - generic [ref=e1783]:
              - combobox [ref=e1784]
              - generic: Industria
              - generic:
                - img
          - generic [ref=e1786]:
            - generic [ref=e1789]:
              - textbox [ref=e1790]
              - generic: WhatsApp
              - generic:
                - img
            - generic [ref=e1798]:
              - textbox [ref=e1799]
              - generic: Email(opcional)
          - generic [ref=e1807]:
            - textbox [ref=e1808]
            - generic: Que proceso queres automatizar?
            - generic [ref=e1815]: 0/500
          - generic [ref=e1816]:
            - button [ref=e1817] [cursor=pointer]:
              - generic [ref=e1821]:
                - text: Enviar consulta
                - img [ref=e1822]
            - generic [ref=e1824]:
              - generic [ref=e1825]:
                - generic [ref=e1826]: Ctrl
                - generic [ref=e1827]: ↵
              - generic [ref=e1828]: para enviar
      - generic [ref=e1829]:
        - generic:
          - img
        - generic [ref=e1836]:
          - generic [ref=e1837]:
            - generic [ref=e1838]:
              - generic [ref=e1839]: MaatWork
              - paragraph [ref=e1840]:
                - text: Tu local, automatizado.
                - text: Tu app, lista para usar.
              - generic [ref=e1841]:
                - link "LinkedIn" [ref=e1842] [cursor=pointer]:
                  - /url: "#"
                  - img [ref=e1844]
                - link "Twitter" [ref=e1847] [cursor=pointer]:
                  - /url: "#"
                  - img [ref=e1849]
                - link "Instagram" [ref=e1852] [cursor=pointer]:
                  - /url: "#"
                  - img [ref=e1854]
            - generic [ref=e1857]:
              - heading "Producto" [level=4] [ref=e1858]
              - list [ref=e1859]:
                - listitem [ref=e1860]:
                  - link "Características" [ref=e1861] [cursor=pointer]:
                    - /url: "#features"
                    - generic [ref=e1863]: Características
                - listitem [ref=e1864]:
                  - link "Precios" [ref=e1865] [cursor=pointer]:
                    - /url: "#pricing"
                    - generic [ref=e1867]: Precios
                - listitem [ref=e1868]:
                  - link "Cómo funciona" [ref=e1869] [cursor=pointer]:
                    - /url: "#how-it-works"
                    - generic [ref=e1871]: Cómo funciona
            - generic [ref=e1872]:
              - heading "Empresa" [level=4] [ref=e1873]
              - list [ref=e1874]:
                - listitem [ref=e1875]:
                  - link "Testimonios" [ref=e1876] [cursor=pointer]:
                    - /url: "#testimonials"
                    - generic [ref=e1878]: Testimonios
                - listitem [ref=e1879]:
                  - link "Preguntas Frecuentes" [ref=e1880] [cursor=pointer]:
                    - /url: "#faq"
                    - generic [ref=e1882]: Preguntas Frecuentes
                - listitem [ref=e1883]:
                  - link "Contacto" [ref=e1884] [cursor=pointer]:
                    - /url: "#contact"
                    - generic [ref=e1886]: Contacto
            - generic [ref=e1887]:
              - heading "Contacto" [level=4] [ref=e1888]
              - list [ref=e1889]:
                - listitem [ref=e1890]:
                  - link "+54 299 456-9840" [ref=e1891] [cursor=pointer]:
                    - /url: tel:+542994569840
                    - img [ref=e1892]
                    - text: +54 299 456-9840
                - listitem [ref=e1894]:
                  - link "clientes@maat.work" [ref=e1895] [cursor=pointer]:
                    - /url: mailto:clientes@maat.work
                    - img [ref=e1896]
                    - text: clientes@maat.work
              - generic [ref=e1902]: Argentina, LATAM
          - img [ref=e1908]
          - generic [ref=e1910]:
            - paragraph [ref=e1911]: © 2026 MaatWork. Construido con determinación en Argentina para LATAM.
            - generic [ref=e1912]:
              - generic [ref=e1913]: Powered by
              - generic [ref=e1914]: Neon
              - generic [ref=e1915]: ·
              - generic [ref=e1916]: Vercel
      - button "Contactar por WhatsApp" [ref=e1921] [cursor=pointer]:
        - img [ref=e1928]
        - generic:
          - generic: Escribinos por WhatsApp
        - status [ref=e1930]: Abre WhatsApp para contactarnos
  - button "Open Next.js Dev Tools" [ref=e1936] [cursor=pointer]:
    - img [ref=e1937]
  - alert [ref=e1940]
  - generic "Social proof notifications":
    - alert [ref=e1942]:
      - generic [ref=e1945]:
        - generic [ref=e1947]: P
        - generic [ref=e1949]:
          - paragraph [ref=e1950]:
            - text: Pablo
            - generic [ref=e1951]: contrato el plan Pro
          - paragraph [ref=e1952]: Montevideo, Uruguay
        - button "Dismiss notification" [ref=e1953]:
          - img [ref=e1954]
```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test';
  2   | 
  3   | test.describe('Navbar Mobile Audit at 375px', () => {
  4   |   const MOBILE_WIDTH = 375;
  5   | 
  6   |   test.beforeEach(async ({ page }) => {
  7   |     await page.setViewportSize({ width: MOBILE_WIDTH, height: 812 });
  8   |     await page.goto('http://localhost:3000');
  9   |     await page.waitForLoadState('networkidle');
  10  |     await page.waitForTimeout(1000);
  11  |   });
  12  | 
  13  |   test('1. Mobile menu button touch target (must be 44x44px)', async ({ page }) => {
  14  |     console.log('\n=== 1. MOBILE MENU BUTTON TOUCH TARGET ===');
  15  |     const menuButton = page.locator('button[aria-label="Menu"]');
  16  |     await expect(menuButton).toBeVisible();
  17  |     const box = await menuButton.boundingBox();
  18  |     console.log(`Menu button size: ${box?.width.toFixed(1)}x${box?.height.toFixed(1)}px`);
  19  |     console.log(`Pass: ${box!.width >= 44 && box!.height >= 44 ? 'YES' : 'NO'} (required: 44x44px)`);
  20  |   });
  21  | 
  22  |   test('2. Menu overlay appearance and animation', async ({ page }) => {
  23  |     console.log('\n=== 2. MENU OVERLAY APPEARANCE ===');
  24  |     const menuButton = page.locator('button[aria-label="Menu"]');
  25  | 
  26  |     // Check for backdrop element BEFORE clicking
  27  |     const backdropBefore = page.locator('[class*="backdrop"]').count();
  28  |     console.log(`Backdrop elements before click: ${backdropBefore}`);
  29  | 
  30  |     await menuButton.click();
  31  |     await page.waitForTimeout(500);
  32  | 
  33  |     // Check for backdrop/overlay after clicking
  34  |     const backdropAfter = page.locator('[class*="backdrop"]').count();
  35  |     console.log(`Backdrop elements after click: ${backdropAfter}`);
  36  | 
  37  |     // Check if mobile menu is visible
  38  |     const mobileMenu = page.locator('header >> text=Características');
  39  |     const isMenuVisible = await mobileMenu.isVisible();
  40  |     console.log(`Mobile menu visible: ${isMenuVisible}`);
  41  | 
  42  |     // Check for overlay styles
  43  |     const menuPanel = page.locator('header > div > div > div').last();
  44  |     const bgColor = await menuPanel.evaluate((el) => window.getComputedStyle(el).backgroundColor);
  45  |     console.log(`Menu panel background: ${bgColor}`);
  46  |   });
  47  | 
  48  |   test('3. Menu item spacing and touch targets', async ({ page }) => {
  49  |     console.log('\n=== 3. MENU ITEM SPACING AND TOUCH TARGETS ===');
  50  |     const menuButton = page.locator('button[aria-label="Menu"]');
> 51  |     await menuButton.click();
      |                      ^ Error: locator.click: Test timeout of 30000ms exceeded.
  52  |     await page.waitForTimeout(500);
  53  | 
  54  |     const menuItems = page.locator('header a[href^="#"]');
  55  |     const count = await menuItems.count();
  56  |     console.log(`Menu items found: ${count}`);
  57  | 
  58  |     for (let i = 0; i < count; i++) {
  59  |       const item = menuItems.nth(i);
  60  |       const box = await item.boundingBox();
  61  |       const text = await item.textContent();
  62  |       console.log(`${text?.trim()}: ${box?.width.toFixed(1)}x${box?.height.toFixed(1)}px`);
  63  |       console.log(`  Touch target pass: ${box!.height >= 44 ? 'YES' : 'NO'}`);
  64  |     }
  65  |   });
  66  | 
  67  |   test('4. Close button visibility and placement', async ({ page }) => {
  68  |     console.log('\n=== 4. CLOSE BUTTON VISIBILITY ===');
  69  |     const menuButton = page.locator('button[aria-label="Menu"]');
  70  |     await menuButton.click();
  71  |     await page.waitForTimeout(500);
  72  | 
  73  |     // Check if aria-label changes to indicate close
  74  |     const ariaLabel = await menuButton.getAttribute('aria-label');
  75  |     const ariaExpanded = await menuButton.getAttribute('aria-expanded');
  76  |     console.log(`Menu button aria-label: ${ariaLabel}`);
  77  |     console.log(`Menu button aria-expanded: ${ariaExpanded}`);
  78  | 
  79  |     // Check X animation in hamburger
  80  |     const hamburgerLines = page.locator('button[aria-label="Menu"] span');
  81  |     const lineCount = await hamburgerLines.count();
  82  |     console.log(`Hamburger lines count: ${lineCount}`);
  83  |   });
  84  | 
  85  |   test('5. Hamburger icon animation smoothness', async ({ page }) => {
  86  |     console.log('\n=== 5. HAMBURGER ANIMATION ===');
  87  |     const menuButton = page.locator('button[aria-label="Menu"]');
  88  | 
  89  |     // Get initial state
  90  |     const line1Before = await page.locator('button[aria-label="Menu"] span').first().evaluate((el) => ({
  91  |       top: window.getComputedStyle(el).top,
  92  |       transform: window.getComputedStyle(el).transform,
  93  |     }));
  94  |     console.log('Line 1 before:', line1Before);
  95  | 
  96  |     await menuButton.click();
  97  |     await page.waitForTimeout(400);
  98  | 
  99  |     const line1After = await page.locator('button[aria-label="Menu"] span').first().evaluate((el) => ({
  100 |       top: window.getComputedStyle(el).top,
  101 |       transform: window.getComputedStyle(el).transform,
  102 |     }));
  103 |     console.log('Line 1 after:', line1After);
  104 |   });
  105 | 
  106 |   test('6. Menu backdrop/blur effect', async ({ page }) => {
  107 |     console.log('\n=== 6. BACKDROP/BLUR EFFECT ===');
  108 |     const menuButton = page.locator('button[aria-label="Menu"]');
  109 | 
  110 |     // Check header styles
  111 |     const headerStyles = await page.locator('header').evaluate((el) => ({
  112 |       position: window.getComputedStyle(el).position,
  113 |       zIndex: window.getComputedStyle(el).zIndex,
  114 |     }));
  115 |     console.log('Header:', headerStyles);
  116 | 
  117 |     await menuButton.click();
  118 |     await page.waitForTimeout(500);
  119 | 
  120 |     // Look for any overlay/backdrop elements
  121 |     const bodyChildren = await page.evaluate(() => {
  122 |       const body = document.body;
  123 |       const children = Array.from(body.children).map((el) => ({
  124 |         tag: el.tagName,
  125 |         class: el.className.substring(0, 100),
  126 |         zIndex: window.getComputedStyle(el).zIndex,
  127 |       }));
  128 |       return children;
  129 |     });
  130 |     console.log('Body children count:', bodyChildren.length);
  131 |     bodyChildren.forEach((child, i) => {
  132 |       if (child.zIndex !== 'auto' && child.zIndex !== '0') {
  133 |         console.log(`  [${i}] ${child.tag}.${child.class} z-index:${child.zIndex}`);
  134 |       }
  135 |     });
  136 |   });
  137 | 
  138 |   test('7. Scroll lock when menu is open', async ({ page }) => {
  139 |     console.log('\n=== 7. SCROLL LOCK ===');
  140 |     const menuButton = page.locator('button[aria-label="Menu"]');
  141 | 
  142 |     // Get body overflow before
  143 |     const overflowBefore = await page.evaluate(() => document.body.style.overflow);
  144 |     console.log(`Body overflow before: "${overflowBefore}"`);
  145 | 
  146 |     // Check if page scroll is locked (body overflow hidden)
  147 |     const bodyOverflowBefore = await page.evaluate(() => window.getComputedStyle(document.body).overflow);
  148 |     console.log(`Body computed overflow before: ${bodyOverflowBefore}`);
  149 | 
  150 |     await menuButton.click();
  151 |     await page.waitForTimeout(500);
```