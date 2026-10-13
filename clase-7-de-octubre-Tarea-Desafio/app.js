/**
 * @brief Representa un arma independiente del jugador.
 *
 * La clase Weapon almacena las características
 * necesarias para definir un arma dentro del juego.
 */
class Weapon {

    /**
     * @brief Construye un nuevo objeto Weapon.
     *
     * @param {string} name Nombre del arma.
     * @param {string} category Categoría utilizada para los bonus.
     * @param {number} damage Daño base.
     * @param {number} cooldown Tiempo entre ataques.
     * @param {number} speed Velocidad del proyectil.
     * @param {number} range Alcance máximo.
     * @param {string} attackType Tipo de ataque.
     * @param {string} illustration Icono del arma.
     * @param {string} description Descripción del arma.
     */
    constructor(
        name,
        category,
        damage,
        cooldown,
        speed,
        range,
        attackType,
        illustration,
        description
    ) {

        // Guarda el nombre recibido dentro del objeto.
        this.name = name;

        // Guarda la categoría del arma.
        this.category = category;

        // Guarda el daño base.
        this.damage = damage;

        // Guarda el tiempo mínimo entre ataques.
        this.cooldown = cooldown;

        // Guarda la velocidad del proyectil.
        this.speed = speed;

        // Guarda el alcance máximo.
        this.range = range;

        // Guarda el tipo de ataque.
        this.attackType = attackType;

        // Guarda el icono utilizado en la interfaz.
        this.illustration = illustration;

        // Guarda la descripción del arma.
        this.description = description;
    }


    /**
     * @brief Devuelve el nombre del arma.
     *
     * @return {string} Nombre del arma.
     */
    getName() {

        // Devuelve el atributo name.
        return this.name;
    }


    /**
     * @brief Devuelve la categoría del arma.
     *
     * @return {string} Categoría.
     */
    getCategory() {

        // Devuelve el atributo category.
        return this.category;
    }


    /**
     * @brief Devuelve el daño base del arma.
     *
     * @return {number} Daño base.
     */
    getDamage() {

        // Devuelve el atributo damage.
        return this.damage;
    }
}


/**
 * @brief Representa una clase de personaje.
 *
 * Cada clase posee estadísticas propias
 * y una categoría de arma con la que recibe bonus.
 */
class HeroClass {

    /**
     * @brief Construye una clase de personaje.
     *
     * @param {string} name Nombre de la clase.
     * @param {string} bonusCategory Categoría beneficiada.
     * @param {number} multiplier Multiplicador de daño.
     * @param {number} health Vida inicial.
     * @param {number} speed Velocidad.
     * @param {string} illustration Icono.
     * @param {string} description Descripción.
     */
    constructor(
        name,
        bonusCategory,
        multiplier,
        health,
        speed,
        illustration,
        description
    ) {

        // Guarda el nombre de la clase.
        this.name = name;

        // Guarda qué categoría de arma recibe bonus.
        this.bonusCategory = bonusCategory;

        // Guarda el multiplicador de daño.
        this.multiplier = multiplier;

        // Guarda la vida inicial.
        this.health = health;

        // Guarda la velocidad.
        this.speed = speed;

        // Guarda el icono utilizado en la interfaz.
        this.illustration = illustration;

        // Guarda la descripción.
        this.description = description;
    }


    /**
     * @brief Comprueba si un arma recibe el bonus de clase.
     *
     * @param {Weapon} weapon Arma a comprobar.
     *
     * @return {boolean} Verdadero si recibe bonus.
     */
    hasBonus(weapon) {

        // Compara la categoría del arma con la categoría preferida de la clase.
        return (
            weapon.getCategory() ===
            this.bonusCategory
        );
    }


    /**
     * @brief Calcula el daño final según el arma y la clase.
     *
     * @param {Weapon} weapon Arma utilizada.
     * @param {number} baseDamage Daño antes del bonus.
     *
     * @return {number} Daño final.
     */
    calculateDamage(
        weapon,
        baseDamage = weapon.getDamage()
    ) {

        // Comprueba si el arma pertenece a la categoría beneficiada.
        if (
            this.hasBonus(weapon)
        ) {

            // Multiplica el daño por el bonus de clase.
            return Math.round(
                baseDamage *
                this.multiplier
            );
        }

        // Si no tiene bonus devuelve el daño sin modificar.
        return baseDamage;
    }
}


/**
 * @brief Representa al personaje controlado por el jugador.
 *
 * Player utiliza una clase HeroClass y un arma Weapon.
 * El arma se relaciona mediante agregación.
 */
class Player {

    /**
     * @brief Construye al jugador.
     *
     * @param {HeroClass} heroClass Clase elegida.
     * @param {Weapon} weapon Arma inicial.
     * @param {number} x Posición horizontal.
     * @param {number} y Posición vertical.
     */
    constructor(
        heroClass,
        weapon,
        x,
        y
    ) {

        // Guarda la clase elegida.
        this.heroClass =
            heroClass;

        /*
         * AGREGACIÓN:
         *
         * El objeto Weapon fue creado independientemente.
         * Player solamente guarda una referencia a ese objeto.
         */
        this.weapon =
            weapon;

        // Guarda la posición horizontal.
        this.x = x;

        // Guarda la posición vertical.
        this.y = y;

        // Define el radio utilizado para las colisiones.
        this.size = 24;

        // Obtiene la vida máxima desde la clase elegida.
        this.maxHealth =
            heroClass.health;

        // La vida actual comienza completamente llena.
        this.health =
            this.maxHealth;

        // Obtiene la velocidad desde la clase elegida.
        this.speed =
            heroClass.speed;

        // Guarda cuándo fue realizado el último ataque.
        this.lastAttack = 0;

        // Guarda cuándo recibió daño por última vez.
        this.lastDamage = 0;


        // El jugador comienza en nivel 1.
        this.level = 1;

        // Comienza sin experiencia.
        this.xp = 0;


        // La mejora Vitalidad comienza en nivel 0.
        this.vitalityLevel = 0;

        // La mejora Daño comienza en nivel 0.
        this.damageLevel = 0;

        // Inicialmente no existe daño adicional.
        this.damageBonus = 0;


        /*
         * Cuenta cuántas veces se completó
         * la barra después de alcanzar nivel 15.
         */
        this.maxLevelCycles = 0;
    }


    /**
     * @brief Cambia el arma actualmente equipada.
     *
     * @param {Weapon} newWeapon Nueva arma.
     */
    changeWeapon(newWeapon) {

        // Reemplaza la referencia al arma anterior por la nueva.
        this.weapon =
            newWeapon;
    }


    /**
     * @brief Devuelve el daño base actual.
     *
     * @return {number} Daño del arma más mejoras.
     */
    getBaseDamage() {

        // Suma el daño original del arma y el bonus obtenido al subir Daño.
        return (
            this.weapon.getDamage() +
            this.damageBonus
        );
    }


    /**
     * @brief Devuelve el daño final del jugador.
     *
     * @return {number} Daño final.
     */
    getDamage() {

        // Pide a HeroClass que aplique el bonus correspondiente.
        return this.heroClass.calculateDamage(
            this.weapon,
            this.getBaseDamage()
        );
    }


    /**
     * @brief Indica si el arma equipada recibe el bonus de clase.
     *
     * @return {boolean} Estado del bonus.
     */
    hasWeaponBonus() {

        // Consulta directamente a HeroClass.
        return this.heroClass.hasBonus(
            this.weapon
        );
    }


    /**
     * @brief Aumenta un nivel de Vitalidad.
     */
    upgradeVitality() {

        // Comprueba si ya alcanzó el máximo de 5 mejoras.
        if (
            this.vitalityLevel >= 5
        ) {

            // Sale del método sin realizar cambios.
            return;
        }


        // Aumenta en uno el nivel de Vitalidad.
        this.vitalityLevel++;

        // Aumenta la vida máxima en 20.
        this.maxHealth += 20;

        // También entrega esos 20 puntos de vida inmediatamente.
        this.health += 20;
    }


    /**
     * @brief Aumenta un nivel de Daño.
     */
    upgradeDamage() {

        // Comprueba si ya alcanzó el máximo.
        if (
            this.damageLevel >= 5
        ) {

            // Sale sin modificar nada.
            return;
        }


        // Sube un nivel de Daño.
        this.damageLevel++;

        // Agrega cinco puntos de daño base.
        this.damageBonus += 5;
    }


    /**
     * @brief Recupera toda la vida del jugador.
     */
    healFull() {

        // Igual la vida actual con la vida máxima.
        this.health =
            this.maxHealth;
    }


    /**
     * @brief Controla el movimiento del jugador.
     *
     * @param {Object} keys Estado de las teclas.
     * @param {number} deltaTime Tiempo entre cuadros.
     * @param {number} width Ancho del mapa.
     * @param {number} height Alto del mapa.
     */
    move(
        keys,
        deltaTime,
        width,
        height
    ) {

        // Comienza sin movimiento horizontal.
        let directionX = 0;

        // Comienza sin movimiento vertical.
        let directionY = 0;


        // Comprueba si W está presionada.
        if (keys["w"]) {

            // Mueve hacia arriba.
            directionY--;
        }


        // Comprueba si S está presionada.
        if (keys["s"]) {

            // Mueve hacia abajo.
            directionY++;
        }


        // Comprueba si A está presionada.
        if (keys["a"]) {

            // Mueve hacia la izquierda.
            directionX--;
        }


        // Comprueba si D está presionada.
        if (keys["d"]) {

            // Mueve hacia la derecha.
            directionX++;
        }


        // Calcula la longitud del vector de movimiento.
        const length =
            Math.hypot(
                directionX,
                directionY
            );


        // Comprueba si realmente se está moviendo.
        if (length > 0) {

            // Normaliza el movimiento horizontal.
            directionX /=
                length;

            // Normaliza el movimiento vertical.
            directionY /=
                length;
        }


        // Actualiza la posición horizontal.
        this.x +=
            directionX *
            this.speed *
            deltaTime;


        // Actualiza la posición vertical.
        this.y +=
            directionY *
            this.speed *
            deltaTime;


        // Impide que salga por los bordes izquierdo o derecho.
        this.x =
            Math.max(
                this.size,
                Math.min(
                    width -
                    this.size,
                    this.x
                )
            );


        // Impide que salga por arriba o abajo.
        this.y =
            Math.max(
                this.size,
                Math.min(
                    height -
                    this.size,
                    this.y
                )
            );
    }


    /**
     * @brief Crea un ataque dirigido hacia el mouse.
     *
     * @param {number} targetX Posición X del mouse.
     * @param {number} targetY Posición Y del mouse.
     * @param {number} currentTime Tiempo actual.
     *
     * @return {Object|null} Ataque creado.
     */
    attack(
        targetX,
        targetY,
        currentTime
    ) {

        // Comprueba si todavía está dentro del tiempo de espera del arma.
        if (
            currentTime -
            this.lastAttack <
            this.weapon.cooldown
        ) {

            // No crea ningún ataque.
            return null;
        }


        // Guarda el momento del nuevo ataque.
        this.lastAttack =
            currentTime;


        // Calcula la distancia horizontal hacia el mouse.
        let directionX =
            targetX -
            this.x;


        // Calcula la distancia vertical hacia el mouse.
        let directionY =
            targetY -
            this.y;


        // Obtiene la longitud total del vector.
        const length =
            Math.hypot(
                directionX,
                directionY
            );


        // Evita dividir por cero.
        if (length === 0) {

            // No crea ataque.
            return null;
        }


        // Normaliza la dirección horizontal.
        directionX /=
            length;

        // Normaliza la dirección vertical.
        directionY /=
            length;


        // Obtiene el daño actual del personaje.
        const damage =
            this.getDamage();


        // Comprueba si utiliza una espada.
        if (
            this.weapon.attackType ===
            "sword"
        ) {

            // Crea y devuelve un ataque cuerpo a cuerpo.
            return new SwordAttack(
                this.x,
                this.y,
                directionX,
                directionY,
                this.weapon.range,
                damage
            );
        }


        // Comprueba si utiliza magia normal.
        if (
            this.weapon.attackType ===
            "magic"
        ) {

            // Crea y devuelve un proyectil mágico.
            return new MagicProjectile(
                this.x,
                this.y,
                directionX,
                directionY,
                this.weapon.speed,
                damage,
                this.weapon.range
            );
        }


        // Comprueba si utiliza magia explosiva.
        if (
            this.weapon.attackType ===
            "explosiveMagic"
        ) {

            // Crea y devuelve una bola explosiva.
            return new ExplosiveMagicProjectile(
                this.x,
                this.y,
                directionX,
                directionY,
                this.weapon.speed,
                damage,
                this.weapon.range
            );
        }


        // Comprueba si utiliza un arco.
        if (
            this.weapon.attackType ===
            "arrow"
        ) {

            // Crea una flecha que puede atravesar hasta tres enemigos.
            return new ArrowProjectile(
                this.x,
                this.y,
                directionX,
                directionY,
                this.weapon.speed,
                damage,
                this.weapon.range,
                3
            );
        }


        // Comprueba si utiliza una ballesta.
        if (
            this.weapon.attackType ===
            "crossbow"
        ) {

            // Crea un proyectil que también atraviesa tres enemigos.
            return new ArrowProjectile(
                this.x,
                this.y,
                directionX,
                directionY,
                this.weapon.speed,
                damage,
                this.weapon.range,
                3
            );
        }


        // Si ningún tipo coincide devuelve null.
        return null;
    }


    /**
     * @brief Dibuja al jugador según su clase y arma.
     */
    draw(
        context,
        targetX,
        targetY
    ) {

        // Guarda el estado actual del canvas.
        context.save();


        // Traslada el origen hasta la posición del jugador.
        context.translate(
            this.x,
            this.y
        );


        // Comprueba si es Caballero.
        if (
            this.heroClass.name ===
            "Caballero"
        ) {

            // Dibuja el Caballero.
            this.drawKnight(
                context
            );
        }


        // Comprueba si es Mago.
        if (
            this.heroClass.name ===
            "Mago"
        ) {

            // Dibuja el Mago.
            this.drawMage(
                context
            );
        }


        // Comprueba si es Arquero.
        if (
            this.heroClass.name ===
            "Arquero"
        ) {

            // Dibuja el Arquero.
            this.drawArcher(
                context
            );
        }


        // Calcula distancia horizontal hacia el mouse.
        const directionX =
            targetX -
            this.x;


        // Calcula distancia vertical hacia el mouse.
        const directionY =
            targetY -
            this.y;


        // Convierte la dirección en un ángulo.
        const angle =
            Math.atan2(
                directionY,
                directionX
            );


        // Dibuja el arma apuntando hacia el mouse.
        this.drawEquippedWeapon(
            context,
            angle
        );


        // Recupera el estado anterior del canvas.
        context.restore();
    }


    /**
     * @brief Dibuja la apariencia del Caballero.
     */
    drawKnight(context) {

        // Define azul como color de la armadura.
        context.fillStyle =
            "#447ac4";

        // Dibuja el torso rectangular.
        context.fillRect(
            -17,
            -2,
            34,
            34
        );


        // Comienza una nueva figura.
        context.beginPath();

        // Define gris metálico.
        context.fillStyle =
            "#bfc6cf";

        // Dibuja el casco circular.
        context.arc(
            0,
            -17,
            17,
            0,
            Math.PI * 2
        );

        // Rellena el casco.
        context.fill();


        // Define gris oscuro para la visera.
        context.fillStyle =
            "#555d68";

        // Dibuja la visera.
        context.fillRect(
            -14,
            -21,
            28,
            7
        );


        // Define blanco para los ojos.
        context.fillStyle =
            "#ffffff";

        // Dibuja ojo izquierdo.
        context.fillRect(
            -8,
            -19,
            4,
            2
        );

        // Dibuja ojo derecho.
        context.fillRect(
            4,
            -19,
            4,
            2
        );


        // Comienza la figura del escudo.
        context.beginPath();

        // Define azul oscuro.
        context.fillStyle =
            "#315c99";

        // Primer punto del escudo.
        context.moveTo(
            -21,
            0
        );

        // Segundo punto.
        context.lineTo(
            -37,
            7
        );

        // Tercer punto.
        context.lineTo(
            -33,
            27
        );

        // Punta inferior.
        context.lineTo(
            -22,
            37
        );

        // Siguiente punto.
        context.lineTo(
            -11,
            27
        );

        // Último punto.
        context.lineTo(
            -8,
            7
        );

        // Cierra la figura.
        context.closePath();

        // Rellena el escudo.
        context.fill();

        // Define color del borde.
        context.strokeStyle =
            "#d8d8d8";

        // Define grosor del borde.
        context.lineWidth = 3;

        // Dibuja el borde.
        context.stroke();
    }


    /**
     * @brief Dibuja la apariencia del Mago.
     */
    drawMage(context) {

        // Comienza la túnica.
        context.beginPath();

        // Define color morado.
        context.fillStyle =
            "#7442a8";

        // Primer punto.
        context.moveTo(
            -12,
            -3
        );

        // Segundo punto.
        context.lineTo(
            -25,
            35
        );

        // Tercer punto.
        context.lineTo(
            25,
            35
        );

        // Cuarto punto.
        context.lineTo(
            12,
            -3
        );

        // Cierra la figura.
        context.closePath();

        // Rellena la túnica.
        context.fill();


        // Comienza la cabeza.
        context.beginPath();

        // Define color de piel.
        context.fillStyle =
            "#e5b987";

        // Dibuja la cabeza.
        context.arc(
            0,
            -17,
            14,
            0,
            Math.PI * 2
        );

        // Rellena la cabeza.
        context.fill();


        // Comienza el sombrero.
        context.beginPath();

        // Define morado oscuro.
        context.fillStyle =
            "#502678";

        // Punta del sombrero.
        context.moveTo(
            3,
            -58
        );

        // Parte izquierda.
        context.lineTo(
            -20,
            -24
        );

        // Parte derecha.
        context.lineTo(
            20,
            -24
        );

        // Cierra.
        context.closePath();

        // Rellena.
        context.fill();


        // Dibuja el ala del sombrero.
        context.fillRect(
            -25,
            -27,
            50,
            7
        );


        // Define color oscuro para los ojos.
        context.fillStyle =
            "#262026";

        // Dibuja ojo izquierdo.
        context.fillRect(
            -7,
            -18,
            3,
            3
        );

        // Dibuja ojo derecho.
        context.fillRect(
            4,
            -18,
            3,
            3
        );
    }


    /**
     * @brief Dibuja la apariencia del Arquero.
     */
    drawArcher(context) {

        // Define verde para el torso.
        context.fillStyle =
            "#458351";

        // Dibuja el cuerpo.
        context.fillRect(
            -16,
            -3,
            32,
            35
        );


        // Comienza la capucha.
        context.beginPath();

        // Define verde oscuro.
        context.fillStyle =
            "#285c35";

        // Parte superior.
        context.moveTo(
            0,
            -40
        );

        // Lado izquierdo.
        context.lineTo(
            -22,
            -15
        );

        // Parte inferior izquierda.
        context.lineTo(
            -15,
            5
        );

        // Parte inferior derecha.
        context.lineTo(
            15,
            5
        );

        // Lado derecho.
        context.lineTo(
            22,
            -15
        );

        // Cierra la figura.
        context.closePath();

        // Rellena la capucha.
        context.fill();


        // Comienza la cara.
        context.beginPath();

        // Color piel.
        context.fillStyle =
            "#dfb17e";

        // Dibuja cara.
        context.arc(
            0,
            -14,
            12,
            0,
            Math.PI * 2
        );

        // Rellena.
        context.fill();


        // Color ojos.
        context.fillStyle =
            "#202020";

        // Ojo izquierdo.
        context.fillRect(
            -6,
            -16,
            3,
            3
        );

        // Ojo derecho.
        context.fillRect(
            3,
            -16,
            3,
            3
        );


        // Define marrón.
        context.fillStyle =
            "#754c29";

        // Dibuja el carcaj.
        context.fillRect(
            -23,
            5,
            8,
            32
        );
    }


    /**
     * @brief Dibuja el arma que está utilizando el jugador.
     */
    drawEquippedWeapon(
        context,
        angle
    ) {

        // Guarda el estado del canvas.
        context.save();

        // Rota el dibujo hacia el mouse.
        context.rotate(
            angle
        );


        // Comprueba si pertenece a la categoría espada.
        if (
            this.weapon.category ===
            "sword"
        ) {

            // Define color del mango.
            context.strokeStyle =
                "#75451f";

            // Define grosor.
            context.lineWidth = 7;

            // Inicia línea.
            context.beginPath();

            // Inicio del mango.
            context.moveTo(
                10,
                8
            );

            // Final del mango.
            context.lineTo(
                27,
                8
            );

            // Dibuja mango.
            context.stroke();


            // Define dorado.
            context.strokeStyle =
                "#d5aa45";

            // Define grosor de la guarda.
            context.lineWidth = 5;

            // Inicia figura.
            context.beginPath();

            // Inicio guarda.
            context.moveTo(
                25,
                0
            );

            // Final guarda.
            context.lineTo(
                25,
                16
            );

            // Dibuja guarda.
            context.stroke();


            // Color normal de hoja.
            context.strokeStyle =
                "#e3e5e8";


            // Comprueba si es espada de fuego.
            if (
                this.weapon.name ===
                "Espada de fuego"
            ) {

                // Cambia a color naranja.
                context.strokeStyle =
                    "#ff6b24";
            }


            // Define grosor de hoja.
            context.lineWidth = 8;

            // Inicia figura.
            context.beginPath();

            // Base de hoja.
            context.moveTo(
                28,
                8
            );

            // Punta.
            context.lineTo(
                70,
                8
            );

            // Dibuja hoja.
            context.stroke();
        }


        // Comprueba si es el Bastón mágico.
        if (
            this.weapon.name ===
            "Bastón mágico"
        ) {

            // Define color de madera.
            context.strokeStyle =
                "#81572d";

            // Define grosor.
            context.lineWidth = 7;

            // Comienza bastón.
            context.beginPath();

            // Inicio.
            context.moveTo(
                8,
                8
            );

            // Final.
            context.lineTo(
                62,
                8
            );

            // Dibuja.
            context.stroke();


            // Comienza orbe.
            context.beginPath();

            // Define morado.
            context.fillStyle =
                "#995cff";

            // Dibuja círculo.
            context.arc(
                67,
                8,
                11,
                0,
                Math.PI * 2
            );

            // Rellena.
            context.fill();


            // Comienza centro del orbe.
            context.beginPath();

            // Define blanco.
            context.fillStyle =
                "#ffffff";

            // Dibuja centro.
            context.arc(
                67,
                8,
                4,
                0,
                Math.PI * 2
            );

            // Rellena.
            context.fill();
        }


        // Comprueba si es la Varita de fuego.
        if (
            this.weapon.name ===
            "Varita de fuego"
        ) {

            // Define color del mango.
            context.strokeStyle =
                "#5d3823";

            // Define grosor.
            context.lineWidth = 6;

            // Comienza línea.
            context.beginPath();

            // Inicio.
            context.moveTo(
                10,
                8
            );

            // Final.
            context.lineTo(
                48,
                8
            );

            // Dibuja mango.
            context.stroke();


            // Comienza esfera exterior.
            context.beginPath();

            // Define naranja.
            context.fillStyle =
                "#ff6f1e";

            // Dibuja círculo.
            context.arc(
                54,
                8,
                11,
                0,
                Math.PI * 2
            );

            // Rellena.
            context.fill();


            // Comienza centro.
            context.beginPath();

            // Define amarillo.
            context.fillStyle =
                "#ffd630";

            // Dibuja centro.
            context.arc(
                54,
                8,
                5,
                0,
                Math.PI * 2
            );

            // Rellena.
            context.fill();
        }


        // Comprueba si el arma es Arco.
        if (
            this.weapon.name ===
            "Arco"
        ) {

            // Define color madera.
            context.strokeStyle =
                "#b77a37";

            // Define grosor.
            context.lineWidth = 5;

            // Comienza dibujo.
            context.beginPath();

            // Dibuja la curva del arco.
            context.arc(
                35,
                8,
                25,
                -Math.PI / 2,
                Math.PI / 2
            );

            // Dibuja.
            context.stroke();


            // Define color de cuerda.
            context.strokeStyle =
                "#eeeeee";

            // Define grosor.
            context.lineWidth = 2;

            // Inicia cuerda.
            context.beginPath();

            // Parte superior.
            context.moveTo(
                35,
                -17
            );

            // Centro.
            context.lineTo(
                20,
                8
            );

            // Parte inferior.
            context.lineTo(
                35,
                33
            );

            // Dibuja cuerda.
            context.stroke();
        }


        // Comprueba si utiliza Ballesta.
        if (
            this.weapon.name ===
            "Ballesta"
        ) {

            // Define color madera.
            context.strokeStyle =
                "#79502c";

            // Define grosor.
            context.lineWidth = 7;

            // Comienza cuerpo.
            context.beginPath();

            // Inicio.
            context.moveTo(
                10,
                8
            );

            // Final.
            context.lineTo(
                58,
                8
            );

            // Dibuja.
            context.stroke();


            // Define otro tono de madera.
            context.strokeStyle =
                "#c59455";

            // Define grosor.
            context.lineWidth = 5;

            // Comienza arco de la ballesta.
            context.beginPath();

            // Parte superior.
            context.moveTo(
                48,
                -14
            );

            // Centro.
            context.lineTo(
                58,
                8
            );

            // Parte inferior.
            context.lineTo(
                48,
                30
            );

            // Dibuja.
            context.stroke();
        }


        // Restaura el canvas.
        context.restore();
    }
}


/**
 * @brief Representa un ataque realizado con una espada.
 */
class SwordAttack {

    /**
     * @brief Construye un ataque de espada.
     */
    constructor(
        x,
        y,
        directionX,
        directionY,
        range,
        damage
    ) {

        // Guarda posición horizontal.
        this.x = x;

        // Guarda posición vertical.
        this.y = y;

        // Guarda dirección horizontal.
        this.directionX =
            directionX;

        // Guarda dirección vertical.
        this.directionY =
            directionY;

        // Guarda alcance.
        this.range =
            range;

        // Guarda daño.
        this.damage =
            damage;

        // Duración de la animación en milisegundos.
        this.duration =
            180;

        // Tiempo transcurrido.
        this.elapsed =
            0;

        // Indica que inicialmente está activo.
        this.active =
            true;

        // Guarda enemigos ya golpeados.
        this.hitEnemies =
            new Set();

        // Define fuerza de empuje.
        this.knockbackForce =
            280;
    }


    /**
     * @brief Actualiza el tiempo del ataque.
     */
    update(deltaTime) {

        // Convierte deltaTime a milisegundos y lo suma.
        this.elapsed +=
            deltaTime *
            1000;


        // Comprueba si terminó la animación.
        if (
            this.elapsed >=
            this.duration
        ) {

            // Desactiva el ataque.
            this.active =
                false;
        }
    }


    /**
     * @brief Comprueba si puede golpear a un enemigo.
     */
    canHit(enemy) {

        // Comprueba si ya lo golpeó.
        if (
            this.hitEnemies.has(
                enemy
            )
        ) {

            // Evita un segundo golpe.
            return false;
        }


        // Calcula diferencia horizontal.
        const enemyX =
            enemy.x -
            this.x;


        // Calcula diferencia vertical.
        const enemyY =
            enemy.y -
            this.y;


        // Calcula distancia total.
        const distance =
            Math.hypot(
                enemyX,
                enemyY
            );


        // Comprueba si está fuera del alcance.
        if (
            distance >
            this.range +
            enemy.size
        ) {

            // No puede golpearlo.
            return false;
        }


        // Comprueba si ambos están exactamente en el mismo punto.
        if (distance === 0) {

            // Permite el golpe.
            return true;
        }


        // Normaliza dirección horizontal hacia el enemigo.
        const normalX =
            enemyX /
            distance;


        // Normaliza dirección vertical.
        const normalY =
            enemyY /
            distance;


        // Calcula producto escalar para saber si está delante.
        const dot =
            normalX *
            this.directionX +
            normalY *
            this.directionY;


        // Solo golpea enemigos dentro del arco frontal.
        return dot > 0.15;
    }


    /**
     * @brief Guarda que un enemigo ya recibió este ataque.
     */
    registerHit(enemy) {

        // Agrega el enemigo al Set.
        this.hitEnemies.add(
            enemy
        );
    }


    /**
     * @brief Dibuja la animación del tajo.
     */
    draw(context) {

        // Calcula el ángulo del ataque.
        const angle =
            Math.atan2(
                this.directionY,
                this.directionX
            );


        // Calcula cuánto avanzó la animación.
        const progress =
            this.elapsed /
            this.duration;


        // Comienza figura.
        context.beginPath();

        // Define color.
        context.strokeStyle =
            "#f4f4f4";

        // Define grosor.
        context.lineWidth =
            12;

        // Dibuja arco de espada.
        context.arc(
            this.x,
            this.y,
            this.range *
            0.75,
            angle -
            0.9 +
            progress *
            0.5,
            angle +
            0.9 +
            progress *
            0.5
        );

        // Renderiza.
        context.stroke();
    }
}


/**
 * @brief Clase base para todos los proyectiles.
 */
class Projectile {

    /**
     * @brief Construye un proyectil.
     */
    constructor(
        x,
        y,
        directionX,
        directionY,
        speed,
        damage,
        range
    ) {

        // Guarda posición X.
        this.x = x;

        // Guarda posición Y.
        this.y = y;

        // Guarda dirección X.
        this.directionX =
            directionX;

        // Guarda dirección Y.
        this.directionY =
            directionY;

        // Guarda velocidad.
        this.speed =
            speed;

        // Guarda daño.
        this.damage =
            damage;

        // Guarda alcance máximo.
        this.range =
            range;

        // Comienza sin haber recorrido distancia.
        this.distance =
            0;

        // Define tamaño para colisiones.
        this.size =
            7;

        // El proyectil comienza activo.
        this.active =
            true;
    }


    /**
     * @brief Actualiza la posición del proyectil.
     */
    update(deltaTime) {

        // Calcula cuánto debe avanzar este cuadro.
        const movement =
            this.speed *
            deltaTime;


        // Mueve horizontalmente.
        this.x +=
            this.directionX *
            movement;


        // Mueve verticalmente.
        this.y +=
            this.directionY *
            movement;


        // Acumula la distancia recorrida.
        this.distance +=
            movement;


        // Comprueba si alcanzó su máximo alcance.
        if (
            this.distance >=
            this.range
        ) {

            // Desactiva el proyectil.
            this.active =
                false;
        }
    }
}


/**
 * @brief Representa un proyectil mágico normal.
 *
 * Hereda de Projectile.
 */
class MagicProjectile
    extends Projectile {

    /**
     * @brief Construye el proyectil mágico.
     */
    constructor(
        x,
        y,
        directionX,
        directionY,
        speed,
        damage,
        range
    ) {

        // Llama al constructor de Projectile.
        super(
            x,
            y,
            directionX,
            directionY,
            speed,
            damage,
            range
        );

        // Inicializa la animación.
        this.animation =
            0;
    }


    /**
     * @brief Actualiza movimiento y animación.
     */
    update(deltaTime) {

        // Ejecuta la actualización de Projectile.
        super.update(
            deltaTime
        );


        // Aumenta el tiempo de animación.
        this.animation +=
            deltaTime *
            10;
    }


    /**
     * @brief Dibuja el proyectil mágico.
     */
    draw(context) {

        // Genera un efecto de pulsación.
        const pulse =
            Math.sin(
                this.animation
            ) *
            3;


        // Comienza halo exterior.
        context.beginPath();

        // Define morado.
        context.fillStyle =
            "#9b5cff";

        // Dibuja halo.
        context.arc(
            this.x,
            this.y,
            12 +
            pulse,
            0,
            Math.PI * 2
        );

        // Rellena.
        context.fill();


        // Comienza centro.
        context.beginPath();

        // Define blanco.
        context.fillStyle =
            "white";

        // Dibuja centro.
        context.arc(
            this.x,
            this.y,
            5,
            0,
            Math.PI * 2
        );

        // Rellena.
        context.fill();
    }
}


/**
 * @brief Representa un proyectil mágico explosivo.
 */
class ExplosiveMagicProjectile
    extends Projectile {

    /**
     * @brief Construye el proyectil explosivo.
     */
    constructor(
        x,
        y,
        directionX,
        directionY,
        speed,
        damage,
        range
    ) {

        // Ejecuta el constructor de Projectile.
        super(
            x,
            y,
            directionX,
            directionY,
            speed,
            damage,
            range
        );

        // Define el radio máximo de la explosión.
        this.explosionRadius =
            130;
    }


    /**
     * @brief Dibuja la bola de fuego.
     */
    draw(context) {

        // Comienza círculo exterior.
        context.beginPath();

        // Define naranja.
        context.fillStyle =
            "#ff6f1e";

        // Dibuja círculo exterior.
        context.arc(
            this.x,
            this.y,
            14,
            0,
            Math.PI * 2
        );

        // Rellena.
        context.fill();


        // Comienza círculo interior.
        context.beginPath();

        // Define amarillo.
        context.fillStyle =
            "#ffd83d";

        // Dibuja centro.
        context.arc(
            this.x,
            this.y,
            7,
            0,
            Math.PI * 2
        );

        // Rellena.
        context.fill();
    }
}


/**
 * @brief Representa una flecha capaz de atravesar enemigos.
 */
class ArrowProjectile
    extends Projectile {

    /**
     * @brief Construye una flecha.
     */
    constructor(
        x,
        y,
        directionX,
        directionY,
        speed,
        damage,
        range,
        maxHits
    ) {

        // Ejecuta constructor base.
        super(
            x,
            y,
            directionX,
            directionY,
            speed,
            damage,
            range
        );

        // Guarda cantidad máxima de impactos.
        this.maxHits =
            maxHits;

        // Comienza con cero enemigos golpeados.
        this.hitCount =
            0;

        // Guarda enemigos ya atravesados.
        this.hitEnemies =
            new Set();

        // Reduce tamaño de colisión.
        this.size =
            5;
    }


    /**
     * @brief Comprueba si todavía puede golpear al enemigo.
     */
    canHit(enemy) {

        // Devuelve true si todavía no está registrado.
        return !this.hitEnemies.has(
            enemy
        );
    }


    /**
     * @brief Registra que la flecha golpeó un enemigo.
     */
    registerHit(enemy) {

        // Agrega enemigo al Set.
        this.hitEnemies.add(
            enemy
        );


        // Incrementa número de impactos.
        this.hitCount++;


        // Comprueba si alcanzó el límite.
        if (
            this.hitCount >=
            this.maxHits
        ) {

            // Desactiva la flecha.
            this.active =
                false;
        }
    }


    /**
     * @brief Dibuja la flecha.
     */
    draw(context) {

        // Calcula ángulo de movimiento.
        const angle =
            Math.atan2(
                this.directionY,
                this.directionX
            );


        // Guarda estado.
        context.save();


        // Traslada origen hasta la flecha.
        context.translate(
            this.x,
            this.y
        );


        // Rota hacia la dirección.
        context.rotate(
            angle
        );


        // Comienza cuerpo.
        context.beginPath();

        // Define marrón.
        context.strokeStyle =
            "#d4a253";

        // Define grosor.
        context.lineWidth =
            4;

        // Inicio del cuerpo.
        context.moveTo(
            -15,
            0
        );

        // Final.
        context.lineTo(
            15,
            0
        );

        // Dibuja.
        context.stroke();


        // Comienza punta.
        context.beginPath();

        // Define gris claro.
        context.fillStyle =
            "#eeeeee";

        // Punta frontal.
        context.moveTo(
            17,
            0
        );

        // Punto superior.
        context.lineTo(
            7,
            -5
        );

        // Punto inferior.
        context.lineTo(
            7,
            5
        );

        // Cierra figura.
        context.closePath();

        // Rellena punta.
        context.fill();


        // Recupera estado anterior.
        context.restore();
    }
}


/**
 * @brief Representa la animación visual de una explosión.
 */
class ExplosionEffect {

    /**
     * @brief Construye una explosión.
     */
    constructor(
        x,
        y,
        radius
    ) {

        // Guarda posición X.
        this.x = x;

        // Guarda posición Y.
        this.y = y;

        // Guarda radio máximo.
        this.radius =
            radius;

        // Inicializa tiempo.
        this.elapsed =
            0;

        // Define duración en milisegundos.
        this.duration =
            300;

        // Comienza activa.
        this.active =
            true;
    }


    /**
     * @brief Actualiza la explosión.
     */
    update(deltaTime) {

        // Suma tiempo transcurrido.
        this.elapsed +=
            deltaTime *
            1000;


        // Comprueba si terminó.
        if (
            this.elapsed >=
            this.duration
        ) {

            // Desactiva.
            this.active =
                false;
        }
    }


    /**
     * @brief Dibuja la explosión.
     */
    draw(context) {

        // Calcula progreso entre 0 y 1.
        const progress =
            this.elapsed /
            this.duration;


        // Calcula radio actual.
        const radius =
            this.radius *
            progress;


        // Reduce opacidad a medida que avanza.
        const opacity =
            1 -
            progress;


        // Comienza área interior.
        context.beginPath();

        // Define naranja transparente.
        context.fillStyle =
            `rgba(255,110,20,${opacity * 0.35})`;

        // Dibuja círculo.
        context.arc(
            this.x,
            this.y,
            radius,
            0,
            Math.PI * 2
        );

        // Rellena.
        context.fill();


        // Comienza borde.
        context.beginPath();

        // Define amarillo transparente.
        context.strokeStyle =
            `rgba(255,220,50,${opacity})`;

        // Define grosor.
        context.lineWidth =
            5;

        // Dibuja círculo.
        context.arc(
            this.x,
            this.y,
            radius,
            0,
            Math.PI * 2
        );

        // Dibuja borde.
        context.stroke();
    }
}


/**
 * @brief Representa una esfera de experiencia dejada por un enemigo.
 */
class XPOrb {

    /**
     * @brief Construye una esfera de experiencia.
     */
    constructor(
        x,
        y,
        value
    ) {

        // Guarda posición X.
        this.x = x;

        // Guarda posición Y.
        this.y = y;

        // Guarda cuánta experiencia entrega.
        this.value =
            value;

        // Define tamaño.
        this.size =
            8;

        // Comienza activa.
        this.active =
            true;

        // Comienza animación en un punto aleatorio.
        this.animation =
            Math.random() *
            Math.PI *
            2;
    }


    /**
     * @brief Actualiza el movimiento de la esfera.
     */
    update(
        player,
        deltaTime
    ) {

        // Calcula distancia horizontal hacia el jugador.
        const directionX =
            player.x -
            this.x;


        // Calcula distancia vertical.
        const directionY =
            player.y -
            this.y;


        // Calcula distancia total.
        const distance =
            Math.hypot(
                directionX,
                directionY
            );


        // Comprueba si está suficientemente cerca.
        if (
            distance <
            140 &&
            distance >
            0
        ) {

            // Define velocidad con la que será atraída.
            const speed =
                190;


            // La mueve horizontalmente hacia el jugador.
            this.x +=
                directionX /
                distance *
                speed *
                deltaTime;


            // La mueve verticalmente.
            this.y +=
                directionY /
                distance *
                speed *
                deltaTime;
        }


        // Actualiza animación.
        this.animation +=
            deltaTime *
            6;
    }


    /**
     * @brief Comprueba si el jugador recogió la esfera.
     */
    isCollected(player) {

        // Calcula distancia entre esfera y jugador.
        const distance =
            Math.hypot(
                player.x -
                this.x,
                player.y -
                this.y
            );


        // Devuelve true si sus áreas se tocan.
        return (
            distance <
            player.size +
            this.size
        );
    }


    /**
     * @brief Dibuja la esfera de experiencia.
     */
    draw(context) {

        // Calcula pulsación.
        const pulse =
            Math.sin(
                this.animation
            ) *
            2;


        // Comienza halo.
        context.beginPath();

        // Define azul transparente.
        context.fillStyle =
            "rgba(70,160,255,0.3)";

        // Dibuja halo.
        context.arc(
            this.x,
            this.y,
            13 +
            pulse,
            0,
            Math.PI * 2
        );

        // Rellena.
        context.fill();


        // Comienza núcleo.
        context.beginPath();

        // Define azul.
        context.fillStyle =
            "#62b6ff";

        // Dibuja esfera.
        context.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        // Rellena.
        context.fill();


        // Comienza centro.
        context.beginPath();

        // Define celeste claro.
        context.fillStyle =
            "#d8f2ff";

        // Dibuja centro.
        context.arc(
            this.x,
            this.y,
            3,
            0,
            Math.PI * 2
        );

        // Rellena.
        context.fill();
    }
}


/**
 * @brief Representa un enemigo Goblin.
 */
class Enemy {

    /**
     * @brief Construye un enemigo de un tipo específico.
     */
    constructor(
        x,
        y,
        type
    ) {

        // Guarda posición X.
        this.x = x;

        // Guarda posición Y.
        this.y = y;

        // Guarda el objeto que contiene las características del tipo.
        this.type =
            type;

        // Copia el nombre del tipo.
        this.name =
            type.name;

        // Copia el tamaño.
        this.size =
            type.size;

        // Copia vida máxima.
        this.maxHealth =
            type.health;

        // Comienza con toda la vida.
        this.health =
            type.health;

        // Copia velocidad.
        this.speed =
            type.speed;

        // Copia daño.
        this.damage =
            type.damage;

        // Copia experiencia entregada.
        this.xpValue =
            type.xp;

        // Copia color principal.
        this.color =
            type.color;

        // Copia color secundario.
        this.darkColor =
            type.darkColor;

        // Comienza sin empuje horizontal.
        this.knockbackX =
            0;

        // Comienza sin empuje vertical.
        this.knockbackY =
            0;
    }


    /**
     * @brief Actualiza el movimiento del enemigo.
     */
    update(
        player,
        deltaTime,
        width,
        height
    ) {

        // Calcula dirección horizontal hacia el jugador.
        const directionX =
            player.x -
            this.x;


        // Calcula dirección vertical.
        const directionY =
            player.y -
            this.y;


        // Calcula distancia.
        const distance =
            Math.hypot(
                directionX,
                directionY
            );


        // Comprueba que exista distancia.
        if (distance > 0) {

            // Mueve horizontalmente hacia el jugador.
            this.x +=
                directionX /
                distance *
                this.speed *
                deltaTime;


            // Mueve verticalmente.
            this.y +=
                directionY /
                distance *
                this.speed *
                deltaTime;
        }


        // Aplica empuje horizontal.
        this.x +=
            this.knockbackX *
            deltaTime;


        // Aplica empuje vertical.
        this.y +=
            this.knockbackY *
            deltaTime;


        // Reduce gradualmente el empuje horizontal.
        this.knockbackX *=
            0.87;


        // Reduce gradualmente el empuje vertical.
        this.knockbackY *=
            0.87;


        // Mantiene al enemigo dentro del mapa horizontalmente.
        this.x =
            Math.max(
                this.size,
                Math.min(
                    width -
                    this.size,
                    this.x
                )
            );


        // Mantiene al enemigo dentro del mapa verticalmente.
        this.y =
            Math.max(
                this.size,
                Math.min(
                    height -
                    this.size,
                    this.y
                )
            );
    }


    /**
     * @brief Aplica daño al enemigo.
     */
    receiveDamage(damage) {

        // Resta la cantidad recibida de su vida.
        this.health -=
            damage;
    }


    /**
     * @brief Aplica empuje al enemigo.
     */
    applyKnockback(
        directionX,
        directionY,
        force
    ) {

        // Calcula velocidad horizontal del empuje.
        this.knockbackX =
            directionX *
            force;


        // Calcula velocidad vertical.
        this.knockbackY =
            directionY *
            force;
    }


    /**
     * @brief Comprueba si el enemigo continúa vivo.
     */
    isAlive() {

        // Devuelve true mientras la vida sea mayor que cero.
        return this.health > 0;
    }


    /**
     * @brief Dibuja al Goblin.
     */
    draw(context) {

        // Guarda estado.
        context.save();


        // Comienza oreja izquierda.
        context.beginPath();

        // Define color oscuro.
        context.fillStyle =
            this.darkColor;

        // Primer punto.
        context.moveTo(
            this.x -
            this.size *
            0.7,
            this.y -
            5
        );

        // Punta.
        context.lineTo(
            this.x -
            this.size *
            1.6,
            this.y -
            14
        );

        // Último punto.
        context.lineTo(
            this.x -
            this.size *
            0.75,
            this.y +
            6
        );

        // Rellena oreja.
        context.fill();


        // Comienza oreja derecha.
        context.beginPath();

        // Primer punto.
        context.moveTo(
            this.x +
            this.size *
            0.7,
            this.y -
            5
        );

        // Punta.
        context.lineTo(
            this.x +
            this.size *
            1.6,
            this.y -
            14
        );

        // Último punto.
        context.lineTo(
            this.x +
            this.size *
            0.75,
            this.y +
            6
        );

        // Rellena.
        context.fill();


        // Comienza cabeza.
        context.beginPath();

        // Utiliza color específico del tipo.
        context.fillStyle =
            this.color;

        // Dibuja cabeza.
        context.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        // Rellena.
        context.fill();


        // Define amarillo para ojos.
        context.fillStyle =
            "#ffef5a";

        // Ojo izquierdo.
        context.fillRect(
            this.x - 12,
            this.y - 8,
            7,
            5
        );

        // Ojo derecho.
        context.fillRect(
            this.x + 5,
            this.y - 8,
            7,
            5
        );


        // Define negro para pupilas.
        context.fillStyle =
            "#111111";

        // Pupila izquierda.
        context.fillRect(
            this.x - 9,
            this.y - 8,
            2,
            5
        );

        // Pupila derecha.
        context.fillRect(
            this.x + 8,
            this.y - 8,
            2,
            5
        );


        // Define color de boca.
        context.fillStyle =
            "#251313";

        // Dibuja boca.
        context.fillRect(
            this.x - 9,
            this.y + 8,
            18,
            5
        );


        // Calcula porcentaje de vida restante.
        const healthPercentage =
            Math.max(
                0,
                this.health /
                this.maxHealth
            );


        // Define fondo de la barra de vida.
        context.fillStyle =
            "#301515";

        // Dibuja barra vacía.
        context.fillRect(
            this.x - 22,
            this.y -
            this.size -
            13,
            44,
            5
        );


        // Define rojo para la vida restante.
        context.fillStyle =
            "#de4444";

        // Dibuja la cantidad proporcional de vida.
        context.fillRect(
            this.x - 22,
            this.y -
            this.size -
            13,
            44 *
            healthPercentage,
            5
        );


        // Restaura el canvas.
        context.restore();
    }
}


/**
 * @brief Representa un jefe.
 *
 * Boss hereda todo el comportamiento de Enemy.
 */
class Boss extends Enemy {

    /**
     * @brief Construye un jefe.
     */
    constructor(
        x,
        y,
        type,
        bossLevel
    ) {

        // Ejecuta constructor de Enemy.
        super(
            x,
            y,
            type
        );

        // Guarda en qué nivel aparece.
        this.bossLevel =
            bossLevel;

        // Identifica explícitamente al objeto como jefe.
        this.isBoss =
            true;
    }


    /**
     * @brief Dibuja al jefe y agrega una corona.
     */
    draw(context) {

        // Utiliza primero el dibujo normal de Enemy.
        super.draw(
            context
        );


        // Guarda estado.
        context.save();


        // Define dorado.
        context.fillStyle =
            "#ffd83d";

        // Comienza corona.
        context.beginPath();

        // Primer punto.
        context.moveTo(
            this.x - 22,
            this.y -
            this.size -
            5
        );

        // Primera punta.
        context.lineTo(
            this.x - 15,
            this.y -
            this.size -
            26
        );

        // Segundo punto.
        context.lineTo(
            this.x - 5,
            this.y -
            this.size -
            13
        );

        // Punta central.
        context.lineTo(
            this.x + 3,
            this.y -
            this.size -
            30
        );

        // Siguiente punto.
        context.lineTo(
            this.x + 12,
            this.y -
            this.size -
            13
        );

        // Última punta.
        context.lineTo(
            this.x + 22,
            this.y -
            this.size -
            26
        );

        // Último punto.
        context.lineTo(
            this.x + 26,
            this.y -
            this.size -
            5
        );

        // Cierra corona.
        context.closePath();

        // Rellena.
        context.fill();


        // Define dorado para nombre.
        context.fillStyle =
            "#ffd75a";

        // Define fuente.
        context.font =
            "bold 14px Arial";

        // Centra texto.
        context.textAlign =
            "center";

        // Dibuja el nombre.
        context.fillText(
            this.name,
            this.x,
            this.y -
            this.size -
            42
        );


        // Recupera estado.
        context.restore();
    }
}


// ==================================================
// TIPOS DE GOBLIN
// ==================================================


// Crea la configuración del Goblin verde.
const normalGoblin = {

    // Identificador interno.
    id: "normal",

    // Nombre visible.
    name: "Goblin verde",

    // Vida máxima.
    health: 80,

    // Daño realizado.
    damage: 10,

    // Velocidad.
    speed: 70,

    // Experiencia entregada.
    xp: 10,

    // Tamaño.
    size: 23,

    // Color principal.
    color: "#5ba93c",

    // Color secundario.
    darkColor: "#468a30"
};


// Crea la configuración del Goblin amarillo.
const yellowGoblin = {

    // Identificador.
    id: "yellow",

    // Nombre.
    name: "Goblin amarillo",

    // Tiene mucha más vida que el verde.
    health: 180,

    // Hace más del doble de daño.
    damage: 22,

    // Es un poco más lento.
    speed: 62,

    // Entrega más experiencia.
    xp: 18,

    // Es más grande.
    size: 28,

    // Color amarillo.
    color: "#d6b83f",

    // Amarillo oscuro.
    darkColor: "#997d20"
};


// Crea la configuración del Goblin violeta.
const purpleGoblin = {

    // Identificador.
    id: "purple",

    // Nombre.
    name: "Goblin violeta",

    // Tiene mucha vida.
    health: 320,

    // Hace mucho daño.
    damage: 40,

    // Además es rápido.
    speed: 88,

    // Entrega mayor experiencia.
    xp: 32,

    // Tamaño.
    size: 29,

    // Color violeta.
    color: "#814fa8",

    // Violeta oscuro.
    darkColor: "#522c70"
};


// ==================================================
// JEFES
// ==================================================


// Configuración del jefe de nivel 5.
const bossLevel5 = {

    // Identificador.
    id: "boss5",

    // Nombre.
    name: "Jefe Goblin",

    // Vida.
    health: 850,

    // Daño.
    damage: 26,

    // Velocidad.
    speed: 48,

    // Experiencia entregada.
    xp: 130,

    // Tamaño.
    size: 42,

    // Color.
    color: "#8ebd32",

    // Color oscuro.
    darkColor: "#54781d"
};


// Configuración del jefe de nivel 10.
const bossLevel10 = {

    // Identificador.
    id: "boss10",

    // Nombre.
    name: "Señor Goblin",

    // Mayor vida.
    health: 1650,

    // Mayor daño.
    damage: 40,

    // Velocidad.
    speed: 58,

    // XP.
    xp: 240,

    // Tamaño.
    size: 46,

    // Color.
    color: "#d28b29",

    // Color oscuro.
    darkColor: "#844f17"
};


// Configuración del jefe de nivel 15.
const bossLevel15 = {

    // Identificador.
    id: "boss15",

    // Nombre.
    name: "Rey Goblin",

    // Muchísima vida.
    health: 2800,

    // Daño muy alto.
    damage: 60,

    // Velocidad.
    speed: 68,

    // XP.
    xp: 400,

    // Tamaño.
    size: 50,

    // Color violeta.
    color: "#a63cc7",

    // Color oscuro.
    darkColor: "#612177"
};


// ==================================================
// ARMAS
// ==================================================


// Crea una espada normal.
const sword =
    new Weapon(

        // Nombre.
        "Espada",

        // Categoría.
        "sword",

        // Daño.
        30,

        // Tiempo entre ataques.
        350,

        // No utiliza velocidad de proyectil.
        0,

        // Alcance.
        105,

        // Tipo de ataque.
        "sword",

        // Icono.
        "⚔️",

        // Descripción.
        "Golpea en arco y empuja a todos los enemigos dentro de su alcance."
    );


// Crea una espada de fuego.
const fireSword =
    new Weapon(
        "Espada de fuego",
        "sword",
        40,
        480,
        0,
        125,
        "sword",
        "🔥🗡️",
        "Mayor daño y alcance, pero ataca más lentamente."
    );


// Crea un bastón mágico.
const magicStaff =
    new Weapon(
        "Bastón mágico",
        "magic",
        25,
        300,
        500,
        600,
        "magic",
        "🔮",
        "Dispara rápidamente proyectiles mágicos."
    );


// Crea una varita de fuego.
const fireWand =
    new Weapon(
        "Varita de fuego",
        "magic",
        35,
        450,
        550,
        650,
        "explosiveMagic",
        "🔥🪄",
        "Explota al impactar y causa daño a enemigos cercanos."
    );


// Crea un arco.
const bow =
    new Weapon(
        "Arco",
        "ranged",
        30,
        390,
        720,
        750,
        "arrow",
        "🏹",
        "Las flechas atraviesan hasta tres enemigos."
    );


// Crea una ballesta.
const crossbow =
    new Weapon(
        "Ballesta",
        "ranged",
        42,
        650,
        850,
        800,
        "crossbow",
        "🎯",
        "Más lenta pero más fuerte. Atraviesa hasta tres enemigos."
    );


// Guarda todas las armas dentro de un array.
const weapons = [
    sword,
    fireSword,
    magicStaff,
    fireWand,
    bow,
    crossbow
];


// ==================================================
// CLASES
// ==================================================


// Crea la clase Caballero.
const knight =
    new HeroClass(

        // Nombre.
        "Caballero",

        // Recibe bonus con espadas.
        "sword",

        // Multiplica daño por 1.5.
        1.5,

        // Vida inicial.
        150,

        // Velocidad.
        180,

        // Icono.
        "🛡️",

        // Descripción.
        "Tiene más vida y causa +50% de daño utilizando espadas."
    );


// Crea la clase Mago.
const mage =
    new HeroClass(
        "Mago",
        "magic",
        1.5,
        105,
        200,
        "🧙",
        "Causa +50% de daño utilizando armas mágicas."
    );


// Crea la clase Arquero.
const archer =
    new HeroClass(
        "Arquero",
        "ranged",
        1.5,
        120,
        215,
        "🏹",
        "Es más rápido y causa +50% de daño utilizando arcos y ballestas."
    );


// Guarda todas las clases.
const heroClasses = [
    knight,
    mage,
    archer
];


/**
 * @brief Controla el funcionamiento general del juego.
 */
class Game {

    /**
     * @brief Construye el controlador principal.
     */
    constructor(canvas) {

        // Guarda el elemento canvas.
        this.canvas =
            canvas;

        // Obtiene el contexto gráfico 2D.
        this.context =
            canvas.getContext(
                "2d"
            );

        // Inicialmente no existe jugador.
        this.player =
            null;

        // Crea array vacío de enemigos.
        this.enemies =
            [];

        // Crea array vacío de ataques.
        this.attacks =
            [];

        // Crea array vacío de efectos.
        this.effects =
            [];

        // Crea array vacío de esferas de experiencia.
        this.xpOrbs =
            [];

        // Crea objeto para guardar teclas presionadas.
        this.keys =
            {};

        // Coloca inicialmente el mouse en el centro horizontal.
        this.mouseX =
            canvas.width /
            2;

        // Coloca inicialmente el mouse en el centro vertical.
        this.mouseY =
            canvas.height /
            2;

        // Indica que el clic izquierdo no está presionado.
        this.mouseDown =
            false;

        // Puntuación inicial.
        this.score =
            0;

        // El juego todavía no está ejecutándose.
        this.running =
            false;

        // Inicialmente no está pausado.
        this.paused =
            false;

        // Tiempo del cuadro anterior.
        this.lastTime =
            0;

        // Momento del último enemigo generado.
        this.lastEnemySpawn =
            0;

        // Clase seleccionada.
        this.selectedClass =
            null;

        // Arma seleccionada.
        this.selectedWeapon =
            null;


        // Indica si actualmente existe un jefe.
        this.bossActive =
            false;


        /*
         * Guarda temporalmente qué jefe debe aparecer
         * después de seleccionar una mejora.
         */
        this.pendingBossLevel =
            null;


        // Registra todos los controles.
        this.registerControls();
    }


    /**
     * @brief Configura teclado, mouse y rueda.
     */
    registerControls() {

        // Escucha cuando se presiona una tecla.
        document.addEventListener(
            "keydown",
            (event) => {

                // Guarda esa tecla como presionada.
                this.keys[
                    event.key.toLowerCase()
                ] = true;
            }
        );


        // Escucha cuando se suelta una tecla.
        document.addEventListener(
            "keyup",
            (event) => {

                // Guarda esa tecla como liberada.
                this.keys[
                    event.key.toLowerCase()
                ] = false;
            }
        );


        // Escucha movimiento del mouse sobre el canvas.
        this.canvas.addEventListener(
            "mousemove",
            (event) => {

                // Actualiza sus coordenadas.
                this.updateMousePosition(
                    event
                );
            }
        );


        // Escucha cuando se presiona un botón del mouse.
        this.canvas.addEventListener(
            "mousedown",
            (event) => {

                // Comprueba botón izquierdo, partida activa y juego sin pausa.
                if (
                    event.button === 0 &&
                    this.running &&
                    !this.paused
                ) {

                    // Actualiza posición del mouse.
                    this.updateMousePosition(
                        event
                    );

                    // Marca clic izquierdo como presionado.
                    this.mouseDown =
                        true;

                    // Realiza ataque inmediatamente.
                    this.attackTowardsMouse(
                        performance.now()
                    );
                }
            }
        );


        // Escucha cuando se suelta el mouse.
        document.addEventListener(
            "mouseup",
            (event) => {

                // Comprueba si fue el botón izquierdo.
                if (
                    event.button === 0
                ) {

                    // Marca clic como liberado.
                    this.mouseDown =
                        false;
                }
            }
        );


        // Escucha la rueda del mouse.
        this.canvas.addEventListener(
            "wheel",
            (event) => {

                // Impide que la rueda desplace la página.
                event.preventDefault();


                // Comprueba que sea posible cambiar arma.
                if (
                    !this.running ||
                    this.paused ||
                    !this.player
                ) {

                    // Sale.
                    return;
                }


                // Comprueba dirección de la rueda.
                if (
                    event.deltaY > 0
                ) {

                    // Cambia al arma siguiente.
                    this.cycleWeapon(
                        1
                    );

                } else {

                    // Cambia al arma anterior.
                    this.cycleWeapon(
                        -1
                    );
                }
            },
            {
                // Permite utilizar preventDefault.
                passive: false
            }
        );
    }


    /**
     * @brief Convierte la posición visual del mouse a coordenadas del canvas.
     */
    updateMousePosition(event) {

        // Obtiene tamaño y posición visual del canvas.
        const rectangle =
            this.canvas.getBoundingClientRect();


        // Calcula relación horizontal.
        const scaleX =
            this.canvas.width /
            rectangle.width;


        // Calcula relación vertical.
        const scaleY =
            this.canvas.height /
            rectangle.height;


        // Convierte posición horizontal real.
        this.mouseX =
            (
                event.clientX -
                rectangle.left
            ) *
            scaleX;


        // Convierte posición vertical.
        this.mouseY =
            (
                event.clientY -
                rectangle.top
            ) *
            scaleY;
    }


    /**
     * @brief Inicia una partida nueva.
     */
    start(
        heroClass,
        weapon
    ) {

        // Guarda clase elegida.
        this.selectedClass =
            heroClass;

        // Guarda arma elegida.
        this.selectedWeapon =
            weapon;


        // Crea nuevo jugador en el centro del mapa.
        this.player =
            new Player(
                heroClass,
                weapon,
                this.canvas.width /
                2,
                this.canvas.height /
                2
            );


        // Elimina enemigos anteriores.
        this.enemies = [];

        // Elimina ataques anteriores.
        this.attacks = [];

        // Elimina efectos anteriores.
        this.effects = [];

        // Elimina XP anterior.
        this.xpOrbs = [];


        // Reinicia puntuación.
        this.score = 0;

        // Activa el juego.
        this.running =
            true;

        // El juego comienza sin pausa.
        this.paused =
            false;

        // No hay jefe activo.
        this.bossActive =
            false;

        // No existe jefe pendiente.
        this.pendingBossLevel =
            null;

        // Guarda tiempo inicial.
        this.lastTime =
            performance.now();

        // Guarda tiempo de spawn.
        this.lastEnemySpawn =
            performance.now();

        // Libera clic.
        this.mouseDown =
            false;


        // Oculta Game Over.
        gameOverPanel.classList.add(
            "hidden"
        );


        // Oculta panel de mejoras.
        upgradePanel.classList.add(
            "hidden"
        );


        // Selecciona visualmente el arma inicial.
        weaponSelect.value =
            weapons.indexOf(
                weapon
            );


        // Actualiza toda la interfaz.
        this.updateInterface();


        // Inicia el bucle principal.
        requestAnimationFrame(
            (time) =>
                this.loop(
                    time
                )
        );
    }


    /**
     * @brief Reinicia desde nivel 1 con la misma clase y arma.
     */
    retry() {

        // Llama nuevamente a start.
        this.start(
            this.selectedClass,
            this.selectedWeapon
        );


        // Muestra mensaje.
        message.textContent =
            "¡Nueva partida!";
    }


    /**
     * @brief Bucle principal ejecutado en cada cuadro.
     */
    loop(currentTime) {

        // Comprueba si el juego está detenido.
        if (!this.running) {

            // Sale.
            return;
        }


        // Calcula tiempo transcurrido entre cuadros.
        const deltaTime =
            Math.min(
                (
                    currentTime -
                    this.lastTime
                ) /
                1000,
                0.033
            );


        // Guarda tiempo actual.
        this.lastTime =
            currentTime;


        // Solo actualiza lógica si no está pausado.
        if (!this.paused) {

            // Actualiza toda la partida.
            this.update(
                deltaTime,
                currentTime
            );
        }


        // Dibuja siempre la escena.
        this.draw();


        // Comprueba que siga ejecutándose.
        if (this.running) {

            // Solicita el próximo cuadro.
            requestAnimationFrame(
                (time) =>
                    this.loop(
                        time
                    )
            );
        }
    }


    /**
     * @brief Actualiza toda la lógica del juego.
     */
    update(
        deltaTime,
        currentTime
    ) {

        // Mueve al jugador.
        this.player.move(
            this.keys,
            deltaTime,
            this.canvas.width,
            this.canvas.height
        );


        // Comprueba si está manteniendo el clic.
        if (
            this.mouseDown
        ) {

            // Intenta realizar otro ataque según cooldown.
            this.attackTowardsMouse(
                currentTime
            );
        }


        // Solo genera enemigos normales si no hay jefe.
        if (!this.bossActive) {

            // Intenta generar enemigos.
            this.spawnEnemies(
                currentTime
            );
        }


        // Recorre todos los ataques.
        for (
            const attack
            of this.attacks
        ) {

            // Actualiza cada ataque.
            attack.update(
                deltaTime
            );
        }


        // Recorre efectos visuales.
        for (
            const effect
            of this.effects
        ) {

            // Actualiza cada efecto.
            effect.update(
                deltaTime
            );
        }


        // Recorre todas las esferas de XP.
        for (
            const orb
            of this.xpOrbs
        ) {

            // Actualiza posición.
            orb.update(
                this.player,
                deltaTime
            );


            // Comprueba si el jugador la recogió.
            if (
                orb.isCollected(
                    this.player
                )
            ) {

                // Desactiva la esfera.
                orb.active =
                    false;


                // Entrega experiencia.
                this.gainXP(
                    orb.value
                );
            }
        }


        // Recorre enemigos.
        for (
            const enemy
            of this.enemies
        ) {

            // Actualiza movimiento.
            enemy.update(
                this.player,
                deltaTime,
                this.canvas.width,
                this.canvas.height
            );
        }


        // Comprueba ataques contra enemigos.
        this.checkAttackCollisions();


        // Comprueba enemigos contra jugador.
        this.checkPlayerCollisions(
            currentTime
        );


        // Conserva únicamente ataques todavía activos.
        this.attacks =
            this.attacks.filter(
                attack =>
                    attack.active
            );


        // Conserva efectos activos.
        this.effects =
            this.effects.filter(
                effect =>
                    effect.active
            );


        // Conserva XP no recogida.
        this.xpOrbs =
            this.xpOrbs.filter(
                orb =>
                    orb.active
            );


        // Conserva enemigos vivos.
        this.enemies =
            this.enemies.filter(
                enemy =>
                    enemy.isAlive()
            );


        // Actualiza interfaz.
        this.updateInterface();


        // Comprueba si murió el jugador.
        if (
            this.player.health <=
            0
        ) {

            // Finaliza partida.
            this.gameOver();
        }
    }


    /**
     * @brief Calcula la XP necesaria para completar la barra.
     */
    getXPRequirement() {

        // Comprueba niveles del 1 al 5.
        if (
            this.player.level <=
            5
        ) {

            /*
             * Nivel 1 = 180.
             * Nivel 2 = 220.
             * Nivel 3 = 260.
             * Nivel 4 = 300.
             * Nivel 5 = 340.
             */
            return (
                180 +
                (
                    this.player.level -
                    1
                ) *
                40
            );
        }


        // Comprueba niveles del 6 al 10.
        if (
            this.player.level <=
            10
        ) {

            // Calcula un requisito mayor.
            return (
                380 +
                (
                    this.player.level -
                    6
                ) *
                70
            );
        }


        // Comprueba niveles del 11 al 14.
        if (
            this.player.level <
            15
        ) {

            // Incrementa aún más el requisito.
            return (
                750 +
                (
                    this.player.level -
                    11
                ) *
                110
            );
        }


        /*
         * En nivel 15 no aumenta el número de nivel,
         * pero cada ciclo exige más experiencia.
         */
        return (
            1300 +
            this.player.maxLevelCycles *
            250
        );
    }


    /**
     * @brief Agrega experiencia al jugador.
     */
    gainXP(amount) {

        // Suma la cantidad recibida.
        this.player.xp +=
            amount;


        // Comprueba si alcanza para subir.
        this.tryLevelUp();


        // Actualiza barra.
        this.updateInterface();
    }


    /**
     * @brief Comprueba si corresponde una subida de nivel.
     */
    tryLevelUp() {

        // Evita subir mientras esté pausado o detenido.
        if (
            this.paused ||
            !this.running
        ) {

            return;
        }


        // Obtiene experiencia necesaria.
        const requiredXP =
            this.getXPRequirement();


        // Comprueba si todavía no alcanza.
        if (
            this.player.xp <
            requiredXP
        ) {

            return;
        }


        // Consume la experiencia necesaria.
        this.player.xp -=
            requiredXP;


        // Comprueba si todavía no llegó a nivel 15.
        if (
            this.player.level <
            15
        ) {

            // Aumenta nivel.
            this.player.level++;


            // Comprueba los niveles con jefe.
            if (
                this.player.level === 5 ||
                this.player.level === 10 ||
                this.player.level === 15
            ) {

                // Guarda qué jefe debe aparecer.
                this.pendingBossLevel =
                    this.player.level;
            }

        } else {

            // Aumenta ciclo de dificultad máxima.
            this.player.maxLevelCycles++;


            // Informa al jugador.
            message.textContent =
                `🔥 Nivel máximo +${this.player.maxLevelCycles}`;
        }


        // Abre selección de mejora.
        this.openUpgradePanel();
    }


    /**
     * @brief Abre el menú de mejoras.
     */
    openUpgradePanel() {

        // Pausa toda la partida.
        this.paused =
            true;

        // Detiene disparos continuos.
        this.mouseDown =
            false;


        // Actualiza qué mejoras pueden aparecer.
        this.updateUpgradeOptions();


        // Muestra panel.
        upgradePanel.classList.remove(
            "hidden"
        );


        // Actualiza HUD.
        this.updateInterface();
    }


    /**
     * @brief Actualiza qué mejoras pueden elegirse.
     */
    updateUpgradeOptions() {

        // Comprueba si Vitalidad todavía no llegó a cinco.
        if (
            this.player.vitalityLevel <
            5
        ) {

            // Muestra botón.
            vitalityUpgradeButton.classList.remove(
                "hidden"
            );


            // Actualiza texto.
            vitalityUpgradeText.textContent =
                `Nivel ${this.player.vitalityLevel}/5 → +20 de vida máxima`;

        } else {

            // Lo oculta cuando llega a 5/5.
            vitalityUpgradeButton.classList.add(
                "hidden"
            );
        }


        // Comprueba daño.
        if (
            this.player.damageLevel <
            5
        ) {

            // Muestra opción.
            damageUpgradeButton.classList.remove(
                "hidden"
            );


            // Actualiza texto.
            damageUpgradeText.textContent =
                `Nivel ${this.player.damageLevel}/5 → +5 de daño base`;

        } else {

            // Lo oculta en 5/5.
            damageUpgradeButton.classList.add(
                "hidden"
            );
        }


        // Curación siempre se muestra.
        healUpgradeButton.classList.remove(
            "hidden"
        );
    }


    /**
     * @brief Aplica la mejora elegida.
     */
    selectUpgrade(type) {

        // Comprueba si eligió Vitalidad.
        if (
            type ===
            "vitality"
        ) {

            // Aplica mejora.
            this.player.upgradeVitality();


            // Muestra mensaje.
            message.textContent =
                `❤️ Vitalidad ${this.player.vitalityLevel}/5`;
        }


        // Comprueba si eligió Daño.
        if (
            type ===
            "damage"
        ) {

            // Aplica mejora.
            this.player.upgradeDamage();


            // Informa nuevo nivel.
            message.textContent =
                `⚔️ Daño ${this.player.damageLevel}/5`;
        }


        // Comprueba si eligió Curación.
        if (
            type ===
            "heal"
        ) {

            // Recupera vida.
            this.player.healFull();


            // Informa.
            message.textContent =
                "💚 Recuperaste toda tu vida.";
        }


        // Oculta menú.
        upgradePanel.classList.add(
            "hidden"
        );


        // Reanuda la partida.
        this.paused =
            false;


        // Actualiza HUD.
        this.updateInterface();


        // Comprueba si debe comenzar un jefe.
        if (
            this.pendingBossLevel !==
            null
        ) {

            // Guarda nivel pendiente.
            const level =
                this.pendingBossLevel;


            // Borra estado pendiente.
            this.pendingBossLevel =
                null;


            // Inicia batalla de jefe.
            this.spawnBossEncounter(
                level
            );
        }


        // Comprueba si quedó suficiente XP para otra subida.
        this.tryLevelUp();
    }


    /**
     * @brief Devuelve el nombre de la dificultad.
     */
    getDifficultyName() {

        // Niveles 1 a 5.
        if (
            this.player.level <=
            5
        ) {

            return "Normal";
        }


        // Niveles 6 a 10.
        if (
            this.player.level <=
            10
        ) {

            return "Difícil";
        }


        // Niveles 11 a 14.
        if (
            this.player.level <
            15
        ) {

            return "Pesadilla";
        }


        // Nivel máximo muestra también el ciclo.
        return (
            `Pesadilla +${this.player.maxLevelCycles}`
        );
    }


    /**
     * @brief Calcula cada cuánto aparecen enemigos.
     */
    getSpawnInterval() {

        // Primer tramo.
        if (
            this.player.level <=
            5
        ) {

            // 1,5 segundos.
            return 1500;
        }


        // Segundo tramo.
        if (
            this.player.level <=
            10
        ) {

            // 1,1 segundos.
            return 1100;
        }


        // Tercer tramo.
        if (
            this.player.level <
            15
        ) {

            // 0,85 segundos.
            return 850;
        }


        /*
         * En nivel máximo reduce 45 ms
         * por cada barra adicional completada.
         *
         * Nunca baja de 350 ms.
         */
        return Math.max(
            350,
            750 -
            this.player.maxLevelCycles *
            45
        );
    }


    /**
     * @brief Devuelve cuántos enemigos aparecen simultáneamente.
     */
    getSpawnAmount() {

        // Nivel 1 a 5.
        if (
            this.player.level <=
            5
        ) {

            // Uno por generación.
            return 1;
        }


        // Nivel 6 a 10.
        if (
            this.player.level <=
            10
        ) {

            // Continúa apareciendo uno.
            return 1;
        }


        // Nivel 11 a 14.
        if (
            this.player.level <
            15
        ) {

            // Aparecen dos simultáneamente.
            return 2;
        }


        /*
         * Nivel 15:
         * comienza con dos y suma uno
         * por cada ciclo máximo.
         *
         * Nunca supera ocho.
         */
        return Math.min(
            8,
            2 +
            this.player.maxLevelCycles
        );
    }


    /**
     * @brief Selecciona aleatoriamente el tipo de Goblin.
     */
    getEnemyType() {

        // Del nivel 1 al 5.
        if (
            this.player.level <=
            5
        ) {

            // Solo verdes.
            return normalGoblin;
        }


        // Del nivel 6 al 10.
        if (
            this.player.level <=
            10
        ) {

            // Genera valor entre 0 y 1.
            const random =
                Math.random();


            // 65% de probabilidad de verde.
            if (
                random < 0.65
            ) {

                return normalGoblin;
            }


            // El otro 35% es amarillo.
            return yellowGoblin;
        }


        // Del nivel 11 al 14.
        if (
            this.player.level <
            15
        ) {

            // Genera probabilidad.
            const random =
                Math.random();


            // 45% verdes.
            if (
                random < 0.45
            ) {

                return normalGoblin;
            }


            // Hasta 80% significa 35% amarillos.
            if (
                random < 0.80
            ) {

                return yellowGoblin;
            }


            // El 20% restante es violeta.
            return purpleGoblin;
        }


        // Guarda el número de ciclos posteriores a nivel 15.
        const cycle =
            this.player.maxLevelCycles;


        // Reduce la probabilidad de verdes progresivamente.
        const greenChance =
            Math.max(
                0.10,
                0.40 -
                cycle *
                0.04
            );


        // Aumenta probabilidad de violetas.
        const purpleChance =
            Math.min(
                0.60,
                0.25 +
                cycle *
                0.04
            );


        // Genera valor aleatorio.
        const random =
            Math.random();


        // Comprueba verdes.
        if (
            random <
            greenChance
        ) {

            return normalGoblin;
        }


        // Comprueba violetas.
        if (
            random >
            1 -
            purpleChance
        ) {

            return purpleGoblin;
        }


        // El resto son amarillos.
        return yellowGoblin;
    }


    /**
     * @brief Genera enemigos normales.
     */
    spawnEnemies(currentTime) {

        // Obtiene intervalo correspondiente.
        const interval =
            this.getSpawnInterval();


        // Comprueba si todavía debe esperar.
        if (
            currentTime -
            this.lastEnemySpawn <
            interval
        ) {

            return;
        }


        // Actualiza momento del último spawn.
        this.lastEnemySpawn =
            currentTime;


        // Obtiene cantidad a generar.
        const amount =
            this.getSpawnAmount();


        // Repite según la cantidad.
        for (
            let i = 0;
            i < amount;
            i++
        ) {

            // Obtiene posición aleatoria en un borde.
            const position =
                this.getSpawnPosition();


            // Obtiene tipo de enemigo según dificultad.
            const type =
                this.getEnemyType();


            // Crea nuevo enemigo.
            this.enemies.push(
                new Enemy(
                    position.x,
                    position.y,
                    type
                )
            );
        }
    }


    /**
     * @brief Devuelve una posición aleatoria en los bordes del mapa.
     */
    getSpawnPosition() {

        // Declara coordenada X.
        let x;

        // Declara coordenada Y.
        let y;


        // Elige un número de 0 a 3.
        const side =
            Math.floor(
                Math.random() *
                4
            );


        // Lado izquierdo.
        if (side === 0) {

            // Cerca del borde izquierdo.
            x = 35;

            // Y aleatorio.
            y =
                Math.random() *
                this.canvas.height;
        }


        // Lado derecho.
        if (side === 1) {

            // Cerca del borde derecho.
            x =
                this.canvas.width -
                35;

            // Y aleatorio.
            y =
                Math.random() *
                this.canvas.height;
        }


        // Lado superior.
        if (side === 2) {

            // X aleatorio.
            x =
                Math.random() *
                this.canvas.width;

            // Cerca del borde superior.
            y = 35;
        }


        // Lado inferior.
        if (side === 3) {

            // X aleatorio.
            x =
                Math.random() *
                this.canvas.width;

            // Cerca del borde inferior.
            y =
                this.canvas.height -
                35;
        }


        // Devuelve ambas coordenadas.
        return {
            x,
            y
        };
    }


    /**
     * @brief Genera un jefe con sus esbirros.
     */
    spawnBossEncounter(level) {

        // Indica que ahora existe un jefe.
        this.bossActive =
            true;


        // Elimina enemigos normales existentes.
        this.enemies =
            [];


        // Elimina ataques que estaban volando.
        this.attacks =
            [];


        // Variable donde se guardará el tipo de jefe.
        let bossType;

        // Variable para el tipo de esbirro.
        let minionType;

        // Variable para cantidad de esbirros.
        let minionAmount;


        // Comprueba jefe de nivel 5.
        if (level === 5) {

            // Selecciona primer jefe.
            bossType =
                bossLevel5;

            // Sus esbirros son verdes.
            minionType =
                normalGoblin;

            // Genera cuatro.
            minionAmount =
                4;
        }


        // Comprueba jefe de nivel 10.
        if (level === 10) {

            // Selecciona segundo jefe.
            bossType =
                bossLevel10;

            // Sus esbirros son amarillos.
            minionType =
                yellowGoblin;

            // Genera cinco.
            minionAmount =
                5;
        }


        // Comprueba jefe final.
        if (level === 15) {

            // Selecciona Rey Goblin.
            bossType =
                bossLevel15;

            // Tipo base de esbirro amarillo.
            minionType =
                yellowGoblin;

            // Genera seis.
            minionAmount =
                6;
        }


        // Coloca jefe en centro horizontal.
        const bossX =
            this.canvas.width /
            2;


        // Lo coloca cerca de la parte superior.
        const bossY =
            90;


        // Crea el jefe.
        this.enemies.push(
            new Boss(
                bossX,
                bossY,
                bossType,
                level
            )
        );


        // Genera todos sus esbirros.
        for (
            let i = 0;
            i < minionAmount;
            i++
        ) {

            // Calcula una posición angular alrededor del jefe.
            const angle =
                (
                    Math.PI *
                    2 *
                    i
                ) /
                minionAmount;


            // Define distancia al jefe.
            const distance =
                100;


            // Calcula posición horizontal.
            const x =
                bossX +
                Math.cos(
                    angle
                ) *
                distance;


            // Calcula posición vertical.
            const y =
                bossY +
                Math.sin(
                    angle
                ) *
                distance;


            // Inicialmente utiliza el tipo definido.
            let type =
                minionType;


            // En jefe nivel 15 algunos son violetas.
            if (
                level === 15 &&
                i % 3 === 0
            ) {

                // Cambia su tipo.
                type =
                    purpleGoblin;
            }


            // Crea el esbirro.
            this.enemies.push(
                new Enemy(
                    x,
                    y,
                    type
                )
            );
        }


        // Muestra aviso de jefe.
        message.textContent =
            `👑 ¡JEFE DE NIVEL ${level}! Derrotá al ${bossType.name} y sus esbirros.`;
    }


    /**
     * @brief Realiza un ataque hacia el mouse.
     */
    attackTowardsMouse(
        currentTime
    ) {

        // Pide al jugador crear el ataque.
        const attack =
            this.player.attack(
                this.mouseX,
                this.mouseY,
                currentTime
            );


        // Comprueba que realmente se haya creado.
        if (attack) {

            // Lo agrega al array.
            this.attacks.push(
                attack
            );
        }
    }


    /**
     * @brief Cambia de arma usando la rueda.
     */
    cycleWeapon(direction) {

        // Busca la posición del arma actual.
        const currentIndex =
            weapons.indexOf(
                this.player.weapon
            );


        // Calcula índice siguiente o anterior.
        let newIndex =
            currentIndex +
            direction;


        // Si supera el final vuelve al primero.
        if (
            newIndex >=
            weapons.length
        ) {

            newIndex = 0;
        }


        // Si pasa antes del primero vuelve al último.
        if (
            newIndex < 0
        ) {

            newIndex =
                weapons.length -
                1;
        }


        // Obtiene la nueva arma.
        const weapon =
            weapons[
                newIndex
            ];


        // Cambia el arma del jugador.
        this.player.changeWeapon(
            weapon
        );


        // Guarda configuración.
        this.selectedWeapon =
            weapon;


        // Sincroniza selector HTML.
        weaponSelect.value =
            newIndex;


        // Actualiza HUD.
        this.updateInterface();


        // Informa el cambio.
        message.textContent =
            `${weapon.illustration} ${weapon.name}`;
    }


    /**
     * @brief Aplica daño a un enemigo y controla su muerte.
     */
    damageEnemy(
        enemy,
        damage
    ) {

        // Guarda si estaba vivo antes del golpe.
        const wasAlive =
            enemy.isAlive();


        // Aplica daño.
        enemy.receiveDamage(
            damage
        );


        // Comprueba si murió debido a este ataque.
        if (
            wasAlive &&
            !enemy.isAlive()
        ) {

            // Comprueba si era un jefe.
            this.score +=
                enemy instanceof Boss
                    ? 100
                    : 10;


            // Crea esfera de experiencia donde murió.
            this.xpOrbs.push(
                new XPOrb(
                    enemy.x,
                    enemy.y,
                    enemy.xpValue
                )
            );


            // Comprueba específicamente si murió un jefe.
            if (
                enemy instanceof Boss
            ) {

                // Finaliza el modo jefe.
                this.bossActive =
                    false;


                // Muestra mensaje de victoria.
                message.textContent =
                    `🏆 ¡Derrotaste a ${enemy.name}!`;
            }
        }
    }


    /**
     * @brief Comprueba colisiones entre ataques y enemigos.
     */
    checkAttackCollisions() {

        // Recorre cada ataque.
        for (
            const attack
            of this.attacks
        ) {

            // Comprueba si es ataque de espada.
            if (
                attack instanceof
                SwordAttack
            ) {

                // Recorre todos los enemigos.
                for (
                    const enemy
                    of this.enemies
                ) {

                    // Comprueba si está dentro del arco.
                    if (
                        attack.canHit(
                            enemy
                        )
                    ) {

                        // Aplica daño.
                        this.damageEnemy(
                            enemy,
                            attack.damage
                        );


                        // Calcula dirección horizontal de empuje.
                        let pushX =
                            enemy.x -
                            attack.x;


                        // Calcula dirección vertical.
                        let pushY =
                            enemy.y -
                            attack.y;


                        // Calcula longitud.
                        const length =
                            Math.hypot(
                                pushX,
                                pushY
                            );


                        // Comprueba que sea válida.
                        if (
                            length > 0
                        ) {

                            // Normaliza X.
                            pushX /=
                                length;

                            // Normaliza Y.
                            pushY /=
                                length;
                        }


                        /*
                         * Los jefes son más resistentes al empuje.
                         */
                        const force =
                            enemy instanceof Boss
                                ? attack.knockbackForce * 0.2
                                : attack.knockbackForce;


                        // Aplica empuje.
                        enemy.applyKnockback(
                            pushX,
                            pushY,
                            force
                        );


                        // Registra que ya fue golpeado.
                        attack.registerHit(
                            enemy
                        );
                    }
                }


                // Pasa al siguiente ataque.
                continue;
            }


            // Recorre enemigos para proyectiles.
            for (
                const enemy
                of this.enemies
            ) {

                // Si el proyectil ya está desactivado deja de comprobar.
                if (!attack.active) {

                    break;
                }


                // Comprueba flechas que ya atravesaron ese enemigo.
                if (
                    attack instanceof
                    ArrowProjectile &&
                    !attack.canHit(
                        enemy
                    )
                ) {

                    // Salta ese enemigo.
                    continue;
                }


                // Calcula distancia entre proyectil y enemigo.
                const distance =
                    Math.hypot(
                        attack.x -
                        enemy.x,
                        attack.y -
                        enemy.y
                    );


                // Comprueba colisión.
                if (
                    distance <
                    attack.size +
                    enemy.size
                ) {

                    // Comprueba si es magia explosiva.
                    if (
                        attack instanceof
                        ExplosiveMagicProjectile
                    ) {

                        // Aplica daño completo al objetivo.
                        this.damageEnemy(
                            enemy,
                            attack.damage
                        );


                        // Genera explosión secundaria.
                        this.explode(
                            attack,
                            enemy
                        );


                        // Desactiva proyectil.
                        attack.active =
                            false;


                        // Sale.
                        break;
                    }


                    // Comprueba si es flecha.
                    if (
                        attack instanceof
                        ArrowProjectile
                    ) {

                        // Aplica daño.
                        this.damageEnemy(
                            enemy,
                            attack.damage
                        );


                        // Registra impacto.
                        attack.registerHit(
                            enemy
                        );


                        // Permite seguir atravesando.
                        continue;
                    }


                    // Si llegó acá es magia normal.
                    this.damageEnemy(
                        enemy,
                        attack.damage
                    );


                    // Desactiva proyectil.
                    attack.active =
                        false;


                    // Termina.
                    break;
                }
            }
        }
    }


    /**
     * @brief Genera el daño de área de la varita.
     */
    explode(
        projectile,
        directEnemy
    ) {

        // Guarda posición horizontal del impacto.
        const explosionX =
            projectile.x;


        // Guarda posición vertical.
        const explosionY =
            projectile.y;


        // Agrega animación de explosión.
        this.effects.push(
            new ExplosionEffect(
                explosionX,
                explosionY,
                projectile.explosionRadius
            )
        );


        // Recorre todos los enemigos.
        for (
            const enemy
            of this.enemies
        ) {

            // Evita dañar nuevamente al objetivo directo.
            if (
                enemy ===
                directEnemy
            ) {

                continue;
            }


            // Calcula distancia desde la explosión.
            const distance =
                Math.hypot(
                    enemy.x -
                    explosionX,
                    enemy.y -
                    explosionY
                );


            // Comprueba si está dentro del radio.
            if (
                distance <=
                projectile.explosionRadius
            ) {

                // Calcula qué tan cerca está del centro.
                const proximity =
                    1 -
                    distance /
                    projectile.explosionRadius;


                /*
                 * Máximo 25% del daño original.
                 *
                 * Se reduce progresivamente
                 * con la distancia.
                 */
                const splashDamage =
                    projectile.damage *
                    0.25 *
                    proximity;


                // Aplica daño secundario.
                this.damageEnemy(
                    enemy,
                    splashDamage
                );
            }
        }
    }


    /**
     * @brief Comprueba colisiones entre enemigos y jugador.
     */
    checkPlayerCollisions(
        currentTime
    ) {

        // Recorre todos los enemigos.
        for (
            const enemy
            of this.enemies
        ) {

            // Calcula distancia.
            const distance =
                Math.hypot(
                    this.player.x -
                    enemy.x,
                    this.player.y -
                    enemy.y
                );


            // Comprueba si están tocándose.
            if (
                distance <
                this.player.size +
                enemy.size
            ) {

                // Comprueba tiempo de invulnerabilidad.
                if (
                    currentTime -
                    this.player.lastDamage >
                    700
                ) {

                    // Resta el daño del enemigo.
                    this.player.health -=
                        enemy.damage;


                    // Impide que la vida sea negativa.
                    this.player.health =
                        Math.max(
                            0,
                            this.player.health
                        );


                    // Guarda cuándo recibió daño.
                    this.player.lastDamage =
                        currentTime;
                }
            }
        }
    }


    /**
     * @brief Dibuja todos los elementos de la partida.
     */
    draw() {

        // Limpia completamente el canvas.
        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );


        // Dibuja fondo.
        this.drawRoom();


        // Recorre esferas de XP.
        for (
            const orb
            of this.xpOrbs
        ) {

            // Dibuja esfera.
            orb.draw(
                this.context
            );
        }


        // Dibuja jugador.
        this.player.draw(
            this.context,
            this.mouseX,
            this.mouseY
        );


        // Recorre ataques.
        for (
            const attack
            of this.attacks
        ) {

            // Dibuja ataque.
            attack.draw(
                this.context
            );
        }


        // Recorre efectos.
        for (
            const effect
            of this.effects
        ) {

            // Dibuja efecto.
            effect.draw(
                this.context
            );
        }


        // Recorre enemigos.
        for (
            const enemy
            of this.enemies
        ) {

            // Dibuja enemigo.
            enemy.draw(
                this.context
            );
        }
    }


    /**
     * @brief Dibuja el suelo de la habitación.
     */
    drawRoom() {

        // Define fondo oscuro.
        this.context.fillStyle =
            "#18181d";


        // Dibuja rectángulo completo.
        this.context.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );


        // Define color de cuadrícula.
        this.context.strokeStyle =
            "#292930";


        // Define tamaño de cada cuadrado.
        const gridSize =
            50;


        // Recorre horizontalmente.
        for (
            let x = 0;
            x <
            this.canvas.width;
            x +=
            gridSize
        ) {

            // Comienza línea.
            this.context.beginPath();

            // Punto superior.
            this.context.moveTo(
                x,
                0
            );

            // Punto inferior.
            this.context.lineTo(
                x,
                this.canvas.height
            );

            // Dibuja.
            this.context.stroke();
        }


        // Recorre verticalmente.
        for (
            let y = 0;
            y <
            this.canvas.height;
            y +=
            gridSize
        ) {

            // Comienza línea.
            this.context.beginPath();

            // Punto izquierdo.
            this.context.moveTo(
                0,
                y
            );

            // Punto derecho.
            this.context.lineTo(
                this.canvas.width,
                y
            );

            // Dibuja.
            this.context.stroke();
        }
    }


    /**
     * @brief Actualiza toda la información visible del HUD.
     */
    updateInterface() {

        // Comprueba que exista jugador.
        if (!this.player) {

            return;
        }


        // Muestra icono y nombre de la clase.
        classNameElement.textContent =
            `${this.player.heroClass.illustration} ${this.player.heroClass.name}`;


        // Comprueba si está en nivel máximo.
        if (
            this.player.level === 15
        ) {

            // Muestra también los ciclos adicionales.
            levelElement.textContent =
                `15/15 (+${this.player.maxLevelCycles})`;

        } else {

            // Muestra nivel normal.
            levelElement.textContent =
                `${this.player.level}/15`;
        }


        // Muestra vida actual y máxima.
        healthElement.textContent =
            `${Math.round(this.player.health)} / ${this.player.maxHealth}`;


        // Muestra nombre del arma.
        weaponNameElement.textContent =
            this.player.weapon.name;


        // Muestra icono del arma.
        currentWeaponIllustration.textContent =
            this.player.weapon.illustration;


        // Muestra daño sin bonus de clase.
        baseDamageElement.textContent =
            this.player.getBaseDamage();


        // Muestra daño final.
        finalDamageElement.textContent =
            this.player.getDamage();


        // Muestra estado del bonus.
        bonusStatusElement.textContent =
            this.player.hasWeaponBonus()
                ? "+50% ACTIVO"
                : "Sin bonus";


        // Muestra dificultad.
        difficultyElement.textContent =
            this.getDifficultyName();


        // Muestra puntos.
        scoreElement.textContent =
            this.score;


        // Obtiene experiencia necesaria.
        const requiredXP =
            this.getXPRequirement();


        // Muestra XP actual / necesaria.
        xpTextElement.textContent =
            `${Math.floor(this.player.xp)} / ${requiredXP}`;


        // Calcula porcentaje de la barra.
        const percentage =
            Math.min(
                100,
                (
                    this.player.xp /
                    requiredXP
                ) *
                100
            );


        // Cambia visualmente el ancho de la barra.
        xpFillElement.style.width =
            `${percentage}%`;


        // Muestra nivel de Vitalidad.
        vitalityLevelElement.textContent =
            `${this.player.vitalityLevel}/5`;


        // Muestra nivel de Daño.
        damageLevelElement.textContent =
            `${this.player.damageLevel}/5`;
    }


    /**
     * @brief Finaliza la partida.
     */
    gameOver() {

        // Detiene el bucle.
        this.running =
            false;

        // Elimina pausa.
        this.paused =
            false;

        // Libera clic.
        this.mouseDown =
            false;


        // Muestra puntuación final.
        finalScore.textContent =
            `Puntuación: ${this.score}`;


        // Muestra nivel alcanzado.
        finalLevel.textContent =
            `Nivel alcanzado: ${this.player.level}/15`;


        // Muestra panel Game Over.
        gameOverPanel.classList.remove(
            "hidden"
        );


        // Muestra mensaje.
        message.textContent =
            "Los goblins derrotaron a tu personaje.";
    }
}


// ==================================================
// ELEMENTOS HTML
// ==================================================


// Obtiene el canvas por su ID.
const canvas =
    document.getElementById(
        "gameCanvas"
    );


// Obtiene panel inicial.
const setupPanel =
    document.getElementById(
        "setupPanel"
    );


// Obtiene selector de clases.
const classSelect =
    document.getElementById(
        "classSelect"
    );


// Obtiene ilustración de clase.
const classIllustration =
    document.getElementById(
        "classIllustration"
    );


// Obtiene cuadro informativo de clase.
const classInformation =
    document.getElementById(
        "classInformation"
    );


// Obtiene selector de arma inicial.
const startWeaponSelect =
    document.getElementById(
        "startWeaponSelect"
    );


// Obtiene ilustración de arma.
const weaponIllustration =
    document.getElementById(
        "weaponIllustration"
    );


// Obtiene información del arma.
const weaponInformation =
    document.getElementById(
        "weaponInformation"
    );


// Obtiene botón comenzar.
const startButton =
    document.getElementById(
        "startButton"
    );


// Obtiene HUD.
const hud =
    document.getElementById(
        "hud"
    );


// Obtiene panel de experiencia.
const xpPanel =
    document.getElementById(
        "xpPanel"
    );


// Obtiene panel de armas.
const weaponPanel =
    document.getElementById(
        "weaponPanel"
    );


// Obtiene selector de arma durante la partida.
const weaponSelect =
    document.getElementById(
        "weaponSelect"
    );


// Obtiene botón de cambio.
const changeWeaponButton =
    document.getElementById(
        "changeWeaponButton"
    );


// Obtiene icono del arma equipada.
const currentWeaponIllustration =
    document.getElementById(
        "currentWeaponIllustration"
    );


// Obtiene texto de clase del HUD.
const classNameElement =
    document.getElementById(
        "className"
    );


// Obtiene texto de nivel.
const levelElement =
    document.getElementById(
        "level"
    );


// Obtiene texto de vida.
const healthElement =
    document.getElementById(
        "health"
    );


// Obtiene texto del arma.
const weaponNameElement =
    document.getElementById(
        "weaponName"
    );


// Obtiene daño base.
const baseDamageElement =
    document.getElementById(
        "baseDamage"
    );


// Obtiene daño final.
const finalDamageElement =
    document.getElementById(
        "finalDamage"
    );


// Obtiene estado del bonus.
const bonusStatusElement =
    document.getElementById(
        "bonusStatus"
    );


// Obtiene dificultad.
const difficultyElement =
    document.getElementById(
        "difficulty"
    );


// Obtiene puntuación.
const scoreElement =
    document.getElementById(
        "score"
    );


// Obtiene texto de XP.
const xpTextElement =
    document.getElementById(
        "xpText"
    );


// Obtiene parte llena de la barra.
const xpFillElement =
    document.getElementById(
        "xpFill"
    );


// Obtiene nivel de Vitalidad.
const vitalityLevelElement =
    document.getElementById(
        "vitalityLevel"
    );


// Obtiene nivel de Daño.
const damageLevelElement =
    document.getElementById(
        "damageLevel"
    );


// Obtiene panel de mejoras.
const upgradePanel =
    document.getElementById(
        "upgradePanel"
    );


// Obtiene botón Vitalidad.
const vitalityUpgradeButton =
    document.getElementById(
        "vitalityUpgradeButton"
    );


// Obtiene descripción de Vitalidad.
const vitalityUpgradeText =
    document.getElementById(
        "vitalityUpgradeText"
    );


// Obtiene botón Daño.
const damageUpgradeButton =
    document.getElementById(
        "damageUpgradeButton"
    );


// Obtiene descripción de Daño.
const damageUpgradeText =
    document.getElementById(
        "damageUpgradeText"
    );


// Obtiene botón Curación.
const healUpgradeButton =
    document.getElementById(
        "healUpgradeButton"
    );


// Obtiene panel Game Over.
const gameOverPanel =
    document.getElementById(
        "gameOverPanel"
    );


// Obtiene puntuación final.
const finalScore =
    document.getElementById(
        "finalScore"
    );


// Obtiene nivel final.
const finalLevel =
    document.getElementById(
        "finalLevel"
    );


// Obtiene botón reintentar.
const retryButton =
    document.getElementById(
        "retryButton"
    );


// Obtiene botón cambiar personaje.
const changeCharacterButton =
    document.getElementById(
        "changeCharacterButton"
    );


// Obtiene panel de controles.
const controls =
    document.getElementById(
        "controls"
    );


// Obtiene elemento donde se muestran mensajes.
const message =
    document.getElementById(
        "message"
    );


// ==================================================
// INTERFAZ
// ==================================================

/**
 * @brief Carga todas las armas dentro de los selectores HTML.
 */
function loadWeapons() {

    // Recorre todas las armas.
    weapons.forEach(
        (weapon, index) => {

            // Crea una nueva opción para el selector inicial.
            const startOption =
                document.createElement(
                    "option"
                );


            // Utiliza el índice como valor.
            startOption.value =
                index;


            // Muestra icono y nombre.
            startOption.textContent =
                `${weapon.illustration} ${weapon.name}`;


            // Agrega la opción.
            startWeaponSelect.appendChild(
                startOption
            );


            // Crea una segunda opción para el selector durante la partida.
            const gameOption =
                document.createElement(
                    "option"
                );


            // Guarda índice.
            gameOption.value =
                index;


            // Muestra nombre e icono.
            gameOption.textContent =
                `${weapon.illustration} ${weapon.name}`;


            // Agrega la opción.
            weaponSelect.appendChild(
                gameOption
            );
        }
    );
}


/**
 * @brief Actualiza la información de la clase seleccionada.
 */
function updateClassSelection() {

    // Convierte el valor del selector en número y obtiene la clase.
    const heroClass =
        heroClasses[
            Number(
                classSelect.value
            )
        ];


    // Cambia el icono.
    classIllustration.textContent =
        heroClass.illustration;


    // Cambia la descripción.
    classInformation.textContent =
        heroClass.description;


    // Recalcula también la información del arma.
    updateWeaponSelection();
}


/**
 * @brief Actualiza la información del arma seleccionada.
 */
function updateWeaponSelection() {

    // Obtiene arma seleccionada.
    const weapon =
        weapons[
            Number(
                startWeaponSelect.value
            )
        ];


    // Obtiene clase seleccionada.
    const heroClass =
        heroClasses[
            Number(
                classSelect.value
            )
        ];


    // Cambia ilustración del arma.
    weaponIllustration.textContent =
        weapon.illustration;


    // Calcula daño considerando la clase.
    const finalDamage =
        heroClass.calculateDamage(
            weapon
        );


    // Comprueba si tiene bonus.
    const bonusText =
        heroClass.hasBonus(
            weapon
        )
            // Texto si existe bonus.
            ? " +50% de bonus de clase."

            // Texto si no existe.
            : " Sin bonus de clase.";


    // Muestra toda la información.
    weaponInformation.textContent =
        `${weapon.description} Daño base: ${weapon.damage}. Daño con esta clase: ${finalDamage}.${bonusText}`;
}


// Crea una única instancia del controlador Game.
const game =
    new Game(
        canvas
    );


// ==================================================
// EVENTOS DE INTERFAZ
// ==================================================


// Escucha cuando cambia la clase.
classSelect.addEventListener(
    "change",
    updateClassSelection
);


// Escucha cuando cambia el arma inicial.
startWeaponSelect.addEventListener(
    "change",
    updateWeaponSelection
);


// Escucha clic en comenzar.
startButton.addEventListener(
    "click",
    () => {

        // Obtiene clase seleccionada.
        const heroClass =
            heroClasses[
                Number(
                    classSelect.value
                )
            ];


        // Obtiene arma seleccionada.
        const weapon =
            weapons[
                Number(
                    startWeaponSelect.value
                )
            ];


        // Oculta menú inicial.
        setupPanel.classList.add(
            "hidden"
        );


        // Muestra HUD.
        hud.classList.remove(
            "hidden"
        );


        // Muestra experiencia.
        xpPanel.classList.remove(
            "hidden"
        );


        // Muestra panel de armas.
        weaponPanel.classList.remove(
            "hidden"
        );


        // Muestra canvas.
        canvas.classList.remove(
            "hidden"
        );


        // Muestra controles.
        controls.classList.remove(
            "hidden"
        );


        // Muestra mensaje inicial.
        message.textContent =
            "¡Comienza la batalla!";


        // Inicia partida.
        game.start(
            heroClass,
            weapon
        );
    }
);


// Escucha botón de cambio manual de arma.
changeWeaponButton.addEventListener(
    "click",
    () => {

        // Evita cambiar si la partida está detenida o pausada.
        if (
            !game.running ||
            game.paused ||
            !game.player
        ) {

            return;
        }


        // Obtiene arma elegida.
        const weapon =
            weapons[
                Number(
                    weaponSelect.value
                )
            ];


        // Cambia el arma mediante agregación.
        game.player.changeWeapon(
            weapon
        );


        // Guarda arma actual.
        game.selectedWeapon =
            weapon;


        // Actualiza interfaz.
        game.updateInterface();


        // Muestra mensaje.
        message.textContent =
            `${weapon.illustration} ${weapon.name}`;
    }
);


// Escucha botón de Vitalidad.
vitalityUpgradeButton.addEventListener(
    "click",
    () => {

        // Selecciona Vitalidad.
        game.selectUpgrade(
            "vitality"
        );
    }
);


// Escucha botón de Daño.
damageUpgradeButton.addEventListener(
    "click",
    () => {

        // Selecciona Daño.
        game.selectUpgrade(
            "damage"
        );
    }
);


// Escucha botón de Curación.
healUpgradeButton.addEventListener(
    "click",
    () => {

        // Selecciona Curación.
        game.selectUpgrade(
            "heal"
        );
    }
);


// Escucha botón Reintentar.
retryButton.addEventListener(
    "click",
    () => {

        // Reinicia partida.
        game.retry();
    }
);


// Escucha botón para cambiar clase o arma.
changeCharacterButton.addEventListener(
    "click",
    () => {

        // Oculta Game Over.
        gameOverPanel.classList.add(
            "hidden"
        );


        // Oculta HUD.
        hud.classList.add(
            "hidden"
        );


        // Oculta XP.
        xpPanel.classList.add(
            "hidden"
        );


        // Oculta panel de armas.
        weaponPanel.classList.add(
            "hidden"
        );


        // Oculta juego.
        canvas.classList.add(
            "hidden"
        );


        // Oculta controles.
        controls.classList.add(
            "hidden"
        );


        // Oculta mejoras.
        upgradePanel.classList.add(
            "hidden"
        );


        // Vuelve a mostrar el menú.
        setupPanel.classList.remove(
            "hidden"
        );


        // Borra estado de teclas.
        game.keys = {};


        // Actualiza información inicial.
        updateClassSelection();


        // Muestra mensaje.
        message.textContent =
            "Elegí una nueva clase y arma.";
    }
);


// ==================================================
// INICIALIZACIÓN DEL PROGRAMA
// ==================================================


// Carga todas las armas en los dos selectores.
loadWeapons();


// Muestra inicialmente la información del Caballero.
updateClassSelection();


// Muestra inicialmente la información de la primera arma.
updateWeaponSelection();