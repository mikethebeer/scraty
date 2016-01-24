
from setuptools import setup


requirements = [
    'tornado'
]


setup(
    name='scraty',
    install_requires=requirements,
    packages=['scraty'],
    entry_points={
        'console_scripts': ['app=scraty.app:main']
    }
)
