document.body.style.opacity = '0'
document.body.style.transition = 'opacity 0.6s ease'

window.addEventListener('load', () => {
  document.body.style.opacity = '1'
})

let idiomaActual = 'es'

const botonesLang = document.querySelectorAll('.lang-btn')

botonesLang.forEach(btn => {
  btn.addEventListener('click', () => {

    idiomaActual = btn.dataset.lang

    botonesLang.forEach(b => b.classList.remove('activo'))
    btn.classList.add('activo')

    document.querySelectorAll('[data-es]').forEach(elem => {
      elem.innerText = elem.dataset[idiomaActual]
    })
  })
})

const contenedorHome = document.getElementById('contenedor-proyectos')
const contenedorProyecto = document.getElementById('proyecto-titulo')

fetch('proyectos.json')
  .then(respuesta => respuesta.json())
  .then(datos => {

    if (contenedorHome) {
      datos.forEach((proy, i) => {
        contenedorHome.innerHTML += `
          <a href="proyecto.html?id=${proy.id}" class="card-link">
            <article class="card">
              <div class="image-container">
                <img src="${proy.imagenPortada}" alt="${proy.titulo[idiomaActual]}">
              </div>
              <div class="card-info">
                <span data-es="${proy.titulo.es}" data-en="${proy.titulo.en}">
                  ${proy.titulo[idiomaActual]}
                </span>
                <p class="card-subtitulo" data-es="${proy.subtitulo?.es || ''}" data-en="${proy.subtitulo?.en || ''}">
                  ${proy.subtitulo?.[idiomaActual] || ''}
                </p>
              </div>
            </article>
          </a>
        `
      })

      gsap.utils.toArray('.card-link').forEach(card => {
        gsap.fromTo(card,
          {
            opacity: 0,
            scale: 0.9
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              end: 'top 5%',
              scrub: 1.5
            }
          }
        )
      })

      document.querySelectorAll('.card-link').forEach(link => {
        link.addEventListener('click', e => {
          e.preventDefault()

          const href = link.href
          const esMovil = window.matchMedia('(max-width: 768px)').matches

          if (esMovil) {
            // En movil evitamos la deformacion del zoom y usamos un fade rapido.
            const fade = document.createElement('div')
            fade.style.position = 'fixed'
            fade.style.inset = '0'
            fade.style.backgroundColor = '#000'
            fade.style.opacity = '0'
            fade.style.transition = 'opacity 0.35s ease'
            fade.style.zIndex = '9999'
            fade.style.pointerEvents = 'none'
            document.body.appendChild(fade)

            requestAnimationFrame(() => {
              fade.style.opacity = '1'
            })

            setTimeout(() => {
              window.location.href = href
            }, 350)

            return
          }

          const img = link.querySelector('img')
          const rect = img.getBoundingClientRect()

          const clone = document.createElement('img')
          clone.src = img.src
          clone.classList.add('transition-clone')
          clone.style.position = 'fixed'
          clone.style.top = rect.top + 'px'
          clone.style.left = rect.left + 'px'
          clone.style.width = rect.width + 'px'
          clone.style.height = rect.height + 'px'
          clone.style.opacity = '1'
          clone.style.zIndex = '9999'
          document.body.appendChild(clone)

          clone.getBoundingClientRect()

          clone.style.top = '0'
          clone.style.left = '0'
          clone.style.width = '100vw'
          clone.style.height = '100vh'

          setTimeout(() => {
            window.location.href = href
          }, 1200)
        })
      })
    }

    if (contenedorProyecto) {
      const urlParams = new URLSearchParams(window.location.search)
      const idBuscado = urlParams.get('id')
      const proyectoEncontrado = datos.find(item => item.id == idBuscado)

      if (proyectoEncontrado) {

        contenedorProyecto.dataset.es = proyectoEncontrado.titulo.es
        contenedorProyecto.dataset.en = proyectoEncontrado.titulo.en
        contenedorProyecto.innerText = proyectoEncontrado.titulo[idiomaActual]

        const descDiv = document.getElementById('proyecto-descripcion')
        if (descDiv) {
          descDiv.dataset.es = proyectoEncontrado.descripcion.es
          descDiv.dataset.en = proyectoEncontrado.descripcion.en
          descDiv.innerText = proyectoEncontrado.descripcion[idiomaActual]
        }
  const specsAnio = document.getElementById('specs-anio')
  if (specsAnio) specsAnio.innerText = proyectoEncontrado.anio

  const specsCliente = document.getElementById('specs-cliente')
  if (specsCliente && proyectoEncontrado.cliente) {
    specsCliente.innerText = proyectoEncontrado.cliente[idiomaActual]
  }

  const specsCategoria = document.getElementById('specs-categoria')
  if (specsCategoria && proyectoEncontrado.categoria) {
    specsCategoria.innerText = proyectoEncontrado.categoria[idiomaActual]
  }

  const specsTags = document.getElementById('specs-tags')
  if (specsTags && proyectoEncontrado.tags) {
    proyectoEncontrado.tags.forEach(tag => {
      specsTags.innerHTML += `<span class="tag">${tag}</span>`
    })
  }

        const galeria = document.getElementById('proyecto-galeria')
        if (galeria) {

          proyectoEncontrado.imagenes.forEach(ruta => {
            galeria.innerHTML += `<img src="${ruta}" alt="Imagen de ${proyectoEncontrado.titulo.es}">`
          })

          const lightbox = document.getElementById('lightbox')
          const lightboxImg = document.getElementById('lightbox-img')

          galeria.addEventListener('click', e => {
            if (e.target.tagName === 'IMG') {
              lightboxImg.src = e.target.src
              lightbox.classList.add('activo')
            }
          })

          lightbox.addEventListener('click', () => {
            lightbox.classList.remove('activo')
            lightboxImg.src = ''
          })
        }

      } else {
        contenedorProyecto.innerText = idiomaActual === 'es' ? "Proyecto no encontrado" : "Project not found"
      }
    }

  })
  .catch(error => console.error("Error cargando el JSON:", error))

const palabras = ['Branding', 'Editorial', 'Ilustración', 'Tipografía', 'Packaging', 'Identidad', 'Concepto', 'Forma']
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const elems = [
  document.getElementById('palabra-0'),
  document.getElementById('palabra-1'),
  document.getElementById('palabra-2')
]

let visibles = [0, 1, 2]

function scramble(target, finalText, onComplete) {
  let iteraciones = 0
  const intervalo = setInterval(() => {
    target.innerText = finalText
      .split('')
      .map((letra, i) => {
        if (i < iteraciones) return finalText[i]
        return chars[Math.floor(Math.random() * chars.length)]
      })
      .join('')

    if (iteraciones >= finalText.length) {
      clearInterval(intervalo)
      if (onComplete) onComplete()
    }

    iteraciones += 0.5
  }, 40)
}

function getNuevaIndice(excluir) {
  let nuevo
  do {
    nuevo = Math.floor(Math.random() * palabras.length)
  } while (excluir.includes(nuevo))
  return nuevo
}

function cambiarTodas() {
  const nuevosVisibles = []

  const posicionRoja = Math.floor(Math.random() * 3)
  elems.forEach((elem, i) => {
    if (i === posicionRoja) {
      elem.classList.add('highlight')
    } else {
      elem.classList.remove('highlight')
    }
  })

  const orden = [0, 1, 2].sort(() => Math.random() - 0.5)

  const delays = [
    Math.floor(Math.random() * 500),
    Math.floor(Math.random() * 500) + 1000,
    Math.floor(Math.random() * 500) + 2000
  ]

  orden.forEach((posicion, turno) => {
    setTimeout(() => {
      const idx = getNuevaIndice(nuevosVisibles)
      nuevosVisibles.push(idx)

      const esFinal = turno === 2
      scramble(elems[posicion], palabras[idx].toUpperCase(), esFinal ? () => {
        visibles = nuevosVisibles
        setTimeout(cambiarTodas, 2500)
      } : null)
    }, delays[turno])
  })
}

if (elems[0] && elems[1] && elems[2]) {
  const posicionRojaInicial = Math.floor(Math.random() * 3)
  elems.forEach((elem, i) => {
    if (i === posicionRojaInicial) elem.classList.add('highlight')
  })
  setTimeout(cambiarTodas, 2000)
}

gsap.registerPlugin(ScrollTrigger)

const letrasLogo = [
  document.getElementById('letra-e1'),
  document.getElementById('letra-f'),
  document.getElementById('letra-e2'),
  document.getElementById('letra-4'),
  document.getElementById('letra-3'),
  document.getElementById('letra-a')
]

const letraE2Logo = document.getElementById('letra-e2')

if (letrasLogo.every(l => l)) {

  const bbox = letraE2Logo.getBBox()
  const cx = bbox.x + bbox.width / 2

  letrasLogo.forEach(letra => {
    letra.style.opacity = '0'
  })

  letraE2Logo.setAttribute('transform',
    `translate(${cx}, 0) scale(-1, 1) translate(${-cx}, 0)`
  )

  document.body.style.overflow = 'hidden'

  const tl = gsap.timeline({
    onComplete: () => {
      document.body.style.overflow = ''
    }
  })

  letrasLogo.forEach((letra, i) => {
    tl.to(letra, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    }, i * 0.15)
  })

  tl.to({}, { duration: 0.3 })

  tl.add(() => {
    letraE2Logo.setAttribute('fill', '#e93a4e')

    setTimeout(() => {
      letraE2Logo.setAttribute('fill', 'black')

      setTimeout(() => {
        letraE2Logo.setAttribute('fill', '#e93a4e')

        setTimeout(() => {
          letraE2Logo.setAttribute('fill', 'black')

          setTimeout(() => {
            letraE2Logo.setAttribute('transform',
              `translate(${cx}, 0) scale(-1, 1) translate(${-cx}, 0)`
            )
            setTimeout(() => {
              letraE2Logo.setAttribute('transform', '')
            }, 80)
          }, 60)
        }, 80)
      }, 60)
    }, 100)
  })

  tl.to({}, { duration: 0.8 })
}


const tituloParaAnimar = document.getElementById('typeit-titulo');

if (tituloParaAnimar) {
  new TypeIt("#typeit-titulo", { 
    lifeLike: false, 
    speed: 0,
    cursor: false 
  })
  .pause(400)
  .type("H")
  .pause(60)
  .type("O")
  .pause(50)
  .type("L")
  .pause(60)
  .type("A")
  .pause(100)
  .type(",")
  .pause(120)
  .type(" ")
  .pause(60)
  .type("S")
  .pause(60)
  .type("H")
  .pause(150)
  .delete(1)
  .pause(80)
  .type("O")
  .pause(100)
  .type("Y")
  .pause(50)
  .type(" ")
  .pause(80)
  .type("B")
  .pause(90)
  .type("L")
  .pause(50)
  .type("A")
  .pause(60)
  .type("N")
  .pause(80)
  .type("C")
  .pause(40)
  .type("A")
  .go();
}

const navLinks = document.querySelectorAll('nav a')

navLinks.forEach(link => {
  const linkPath = new URL(link.href).pathname.split('/').pop() || 'index.html'
  const currentPage = window.location.pathname.split('/').pop() || 'index.html'

  if (linkPath === currentPage) {
    link.classList.add('nav-activo')
  }
})


const menuToggle = document.querySelector('.menu-toggle')
const navOverlay = document.querySelector('.nav-overlay')

if (menuToggle && navOverlay) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('abierto')
    navOverlay.classList.toggle('abierto')
    document.body.style.overflow = navOverlay.classList.contains('abierto') ? 'hidden' : ''
  })

  navOverlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('abierto')
      navOverlay.classList.remove('abierto')
      document.body.style.overflow = ''
    })
  })
}
