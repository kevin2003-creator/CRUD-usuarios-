import bcrypt

# Reemplaza estos valores por los que quieras probar
password_plana = "lopez"
password_hasheada = b"$2b$12$hDgCyyyjwFPUHyjo7ekXKOcQGI/J.8cDPJM1jSNppeK/rzwV1tG2."  # Ejemplo

def verificar_password(plain_text, hashed_password):
    # Asegura que el hash esté en formato bytes
    if isinstance(hashed_password, str):
        hashed_password = hashed_password.encode('utf-8')
    
    return bcrypt.checkpw(plain_text.encode('utf-8'), hashed_password)

if __name__ == "__main__":
    if verificar_password(password_plana, password_hasheada):
        print("✅ La contraseña es válida.")
    else:
        print("❌ La contraseña NO coincide.")


