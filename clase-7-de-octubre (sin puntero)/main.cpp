#include <iostream>  // Permite utilizar cout y endl.
#include <string>    // Permite utilizar el tipo string.

using namespace std; // Permite evitar escribir std:: delante de cout, string, etc.


// ==================================================
// CLASE ARMA
// ==================================================

/**
 * @brief Representa un arma que puede utilizar un personaje.
 */
class Arma // Declara la clase Arma.
{
private: // Atributos que solo puede utilizar directamente la propia clase.

    string nombre; // Guarda el nombre del arma.
    int danio;     // Guarda el daño del arma.

public: // Métodos accesibles desde fuera de la clase.

    /**
     * @brief Constructor de la clase Arma.
     *
     * @param nombre Nombre del arma.
     * @param danio Cantidad de daño que realiza.
     */
    Arma(string nombre, int danio) // Constructor que recibe dos parámetros.
    {
        this->nombre = nombre; // Guarda el nombre recibido.
        this->danio = danio;   // Guarda el daño recibido.
    }

    /**
     * @brief Realiza un ataque utilizando el arma.
     */
    void atacar() // Método sin valor de retorno.
    {
        cout << "Ataque con " << nombre // Muestra el nombre del arma.
             << ": " << danio           // Muestra el daño.
             << " puntos de daño"       // Muestra el mensaje.
             << endl;                   // Salto de línea.
    }

    /**
     * @brief Devuelve el daño del arma.
     *
     * @return Cantidad de daño.
     */
    int getDanio() // Método que devuelve un int.
    {
        return danio; // Devuelve el daño.
    }

    /**
     * @brief Devuelve el nombre del arma.
     *
     * @return Nombre del arma.
     */
    string getNombre() // Método que devuelve un string.
    {
        return nombre; // Devuelve el nombre.
    }
};


// ==================================================
// CLASE HABILIDAD
// ==================================================

/**
 * @brief Representa una habilidad de un personaje.
 */
class Habilidad // Declara la clase Habilidad.
{
private: // Atributos privados.

    string nombre; // Nombre de la habilidad.
    int poder;     // Poder de la habilidad.

public: // Métodos públicos.

    /**
     * @brief Constructor de la clase Habilidad.
     *
     * @param nombre Nombre de la habilidad.
     * @param poder Poder de la habilidad.
     */
    Habilidad(string nombre, int poder) // Constructor.
    {
        this->nombre = nombre; // Guarda el nombre recibido.
        this->poder = poder;   // Guarda el poder recibido.
    }

    /**
     * @brief Utiliza la habilidad.
     */
    void usar() // Método para utilizar la habilidad.
    {
        cout << "Se utiliza " << nombre // Muestra el nombre.
             << ": " << poder           // Muestra el poder.
             << " puntos de poder"      // Muestra el texto.
             << endl;                   // Salto de línea.
    }

    /**
     * @brief Devuelve el nombre de la habilidad.
     *
     * @return Nombre de la habilidad.
     */
    string getNombre() // Devuelve un string.
    {
        return nombre; // Devuelve el nombre.
    }
};


// ==================================================
// CLASE PERSONAJE
// ==================================================

/**
 * @brief Representa un personaje con vida, arma y habilidad.
 */
class Personaje // Declara la clase Personaje.
{
private: // Atributos privados.

    string nombre;       // Guarda el nombre del personaje.
    int vida;            // Guarda su vida.
    Arma arma;           // Guarda directamente un objeto Arma.
    Habilidad habilidad; // Guarda directamente un objeto Habilidad.

public: // Métodos públicos.

    /**
     * @brief Constructor de la clase Personaje.
     *
     * @param nombre Nombre del personaje.
     * @param vida Vida inicial.
     * @param arma Arma del personaje.
     * @param habilidad Habilidad del personaje.
     */
    Personaje(
        string nombre,       // Recibe el nombre.
        int vida,            // Recibe la vida.
        Arma arma,           // Recibe un objeto Arma.
        Habilidad habilidad  // Recibe un objeto Habilidad.
    )
        : arma(arma), habilidad(habilidad)
        // Inicializa los objetos arma y habilidad.
    {
        this->nombre = nombre; // Guarda el nombre recibido.
        this->vida = vida;     // Guarda la vida recibida.
    }

    /**
     * @brief Hace que el personaje ataque con su arma.
     */
    void atacar() // Método de ataque.
    {
        cout << nombre << " ataca:" << endl;
        // Muestra qué personaje está atacando.

        arma.atacar();
        // Ejecuta atacar() directamente sobre el objeto arma.
    }

    /**
     * @brief Hace que el personaje utilice su habilidad.
     */
    void usarHabilidad() // Método para usar la habilidad.
    {
        cout << nombre
             << " utiliza una habilidad:"
             << endl;
        // Muestra qué personaje utiliza la habilidad.

        habilidad.usar();
        // Ejecuta usar() sobre el objeto habilidad.
    }

    /**
     * @brief Cambia el arma actual del personaje.
     *
     * @param nuevaArma Nueva arma del personaje.
     */
    void cambiarArma(Arma nuevaArma) // Recibe otro objeto Arma.
    {
        arma = nuevaArma;
        // Copia nuevaArma dentro del atributo arma.

        cout << nombre
             << " ahora utiliza "
             << nuevaArma.getNombre()
             << endl;
        // Muestra el nombre del arma nueva.
    }

    /**
     * @brief Reduce la vida del personaje.
     *
     * @param danio Cantidad de daño recibido.
     */
    void recibirDanio(int danio) // Recibe la cantidad de daño.
    {
        vida -= danio;
        // Resta el daño a la vida.

        cout << nombre
             << " recibio "
             << danio
             << " puntos de daño."
             << endl;
        // Muestra cuánto daño recibió.

        cout << "Vida restante: "
             << vida
             << endl;
        // Muestra la vida restante.
    }
};


// ==================================================
// FUNCIÓN PRINCIPAL
// ==================================================

/**
 * @brief Función principal del programa.
 *
 * @return 0 si el programa termina correctamente.
 */
int main() // Comienza la ejecución del programa.
{
    Arma espada("Espada de fuego", 30);
    // Crea directamente un objeto espada.
    // No utiliza new ni punteros.

    Arma arco("Arco magico", 20);
    // Crea directamente otro objeto Arma.

    Habilidad curacion("Curacion", 25);
    // Crea directamente una habilidad.

    Habilidad escudo("Escudo magico", 15);
    // Crea otra habilidad.

    Personaje guerrero(
        "Guerrero",
        100,
        espada,
        curacion
    );
    // Crea directamente un Personaje.
    // Guarda una copia de espada y curacion.

    guerrero.atacar();
    // Ejecuta atacar() usando punto porque guerrero es un objeto normal.

    guerrero.usarHabilidad();
    // Ejecuta la habilidad del guerrero.

    guerrero.recibirDanio(20);
    // Le resta 20 puntos de vida.

    guerrero.cambiarArma(arco);
    // Copia arco dentro del personaje.

    guerrero.atacar();
    // Ataca nuevamente utilizando el arco.

    Personaje arquero(
        "Arquero",
        80,
        arco,
        escudo
    );
    // Crea otro personaje.
    // Recibe copias de arco y escudo.

    arquero.atacar();
    // El arquero ataca.

    arquero.usarHabilidad();
    // El arquero utiliza su habilidad.

    return 0;
    // Termina correctamente el programa.
}
